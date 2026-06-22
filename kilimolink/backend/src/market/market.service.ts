import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { Role } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { RedisService } from '../common/redis/redis.service';

@Injectable()
export class MarketService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async createProduct(farmerId: string, dto: CreateProductDto) {
    const user = await this.prisma.user.findUnique({ where: { id: farmerId } });
    if (!user || user.role !== Role.FARMER) {
      throw new BadRequestException('Only farmers can create products');
    }

    if (dto.phone) {
      await this.prisma.user.update({
        where: { id: farmerId },
        data: { phone: dto.phone },
      });
    }

    const product = await this.prisma.product.create({
      data: {
        title: dto.title,
        description: dto.description,
        price: dto.price,
        quantity: dto.quantity,
        category: dto.category,
        imageUrl: dto.imageUrl,
        location: dto.location as any,
        farmerId: farmerId,
      },
    });

    // Invalidate product list cache
    await this.redis.del('products:all');
    
    return product;
  }

  async listProducts(params: {
    lat?: number; lng?: number; page?: number; limit?: number;
    search?: string; category?: string; minPrice?: number; maxPrice?: number; sort?: string;
  }) {
    const { lat, lng, page = 1, limit = 50, search, category, minPrice, maxPrice, sort } = params;
    const skip = (page - 1) * limit;
    const cacheKey = `products:${search || ''}:${category || ''}:${minPrice || ''}:${maxPrice || ''}:${sort || 'newest'}:page${page}:limit${limit}`;

    const where: any = {};
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (category) where.category = category;
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price_asc') orderBy = { price: 'asc' };
    else if (sort === 'price_desc') orderBy = { price: 'desc' };

    let products: any[];
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      products = JSON.parse(cached);
    } else {
      products = await this.prisma.product.findMany({
        skip,
        take: limit,
        where,
        include: { farmer: true },
        orderBy,
      });

      const productIds = products.map((p: any) => p.id);
      const reviewAggs = await this.getReviewAggregations(productIds);

      products = products.map((p: any) => ({
        ...p,
        avgRating: reviewAggs.get(p.id)?.avgRating ?? null,
        reviewCount: reviewAggs.get(p.id)?.reviewCount ?? 0,
      }));

      await this.redis.set(cacheKey, JSON.stringify(products), 300);
    }

    if (lat !== undefined && lng !== undefined) {
      products = products
        .map((p: any) => {
          const distance = this.calculateDistance(lat, lng, p.location?.lat, p.location?.lng);
          return { ...p, distance };
        })
        .sort((a, b) => (a.distance || 0) - (b.distance || 0));
    }

    const total = await this.prisma.product.count({ where });
    return { products, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getProductById(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: { farmer: true },
    });
    if (!product) throw new NotFoundException('Product not found');

    const reviewAgg = await this.prisma.review.aggregate({
      where: { productId },
      _avg: { rating: true },
      _count: true,
    });

    return {
      ...product,
      avgRating: reviewAgg._avg.rating ?? null,
      reviewCount: reviewAgg._count,
    };
  }

  async getMyProducts(farmerId: string) {
    return this.prisma.product.findMany({
      where: { farmerId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateProduct(productId: string, farmerId: string, dto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new NotFoundException('Product not found');
    if (product.farmerId !== farmerId) throw new BadRequestException('You can only edit your own products');

    const updated = await this.prisma.product.update({
      where: { id: productId },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.price !== undefined && { price: dto.price }),
        ...(dto.quantity !== undefined && { quantity: dto.quantity }),
        ...(dto.category !== undefined && { category: dto.category }),
        ...(dto.imageUrl !== undefined && { imageUrl: dto.imageUrl }),
        ...(dto.location !== undefined && { location: dto.location as any }),
      },
    });

    await this.redis.del('products:all');
    return updated;
  }

  async deleteProduct(productId: string, farmerId: string) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new NotFoundException('Product not found');
    if (product.farmerId !== farmerId) throw new BadRequestException('You can only delete your own products');

    await this.prisma.product.delete({ where: { id: productId } });
    await this.redis.del('products:all');
    return { success: true };
  }

  private async getReviewAggregations(productIds: string[]) {
    const aggs = await this.prisma.review.groupBy({
      by: ['productId'],
      where: { productId: { in: productIds } },
      _avg: { rating: true },
      _count: true,
    });

    const map = new Map<string, { avgRating: number; reviewCount: number }>();
    for (const agg of aggs) {
      map.set(agg.productId, {
        avgRating: agg._avg.rating ?? 0,
        reviewCount: agg._count,
      });
    }
    return map;
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number | null {
    if (lat2 === undefined || lon2 === undefined || lat1 === undefined || lon1 === undefined) return null;
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
