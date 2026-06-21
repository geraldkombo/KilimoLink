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

  async listProducts(lat?: number, lng?: number, page = 1, limit = 50) {
    const skip = (page - 1) * limit;
    const cacheKey = `products:page${page}:limit${limit}`;
    let products: any[];

    const cached = await this.redis.get(cacheKey);
    if (cached) {
      products = JSON.parse(cached);
    } else {
      products = await this.prisma.product.findMany({
        skip,
        take: limit,
        include: { farmer: true },
        orderBy: { createdAt: 'desc' },
      });
      await this.redis.set(cacheKey, JSON.stringify(products), 300);
    }

    if (lat !== undefined && lng !== undefined) {
      return products
        .map((p: any) => {
          const distance = this.calculateDistance(lat, lng, p.location?.lat, p.location?.lng);
          return { ...p, distance };
        })
        .sort((a, b) => (a.distance || 0) - (b.distance || 0));
    }

    const total = await this.prisma.product.count();
    return { products, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getProductById(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: { farmer: true },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
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
