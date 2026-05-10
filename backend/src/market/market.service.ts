import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { PrismaService } from '../common/prisma/prisma.service';
import { VerificationService } from '../common/verification/verification.service';
import { CreateProductDto } from './dto/create-product.dto';
import { PlaceOrderDto } from './dto/place-order.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class MarketService {
  constructor(private readonly prisma: PrismaService, private readonly verification: VerificationService) {}

  private stripHtml(input: string) {
    return input.replace(/<[^>]*>/g, '');
  }

  async createProduct(userId: string, dto: CreateProductDto) {
    const business = await this.prisma.business.findUnique({ where: { userId } });
    if (!business) throw new BadRequestException('Business profile required');

    return this.prisma.product.create({
      data: {
        businessId: business.id,
        name: dto.name,
        category: dto.category,
        priceKes: dto.priceKes,
        quantity: dto.quantity,
        unit: dto.unit,
        description: dto.description,
        county: business.county,
        images: dto.photoUrl ? { create: [{ url: dto.photoUrl, sortOrder: 0 }] } : undefined
      },
      include: { images: true }
    });
  }

  async listProducts(query: Record<string, string>) {
    const where: any = {};
    if (query.category) where.category = { contains: query.category, mode: 'insensitive' };
    if (query.county) where.county = { equals: query.county };
    if (query.minPrice) where.priceKes = { ...(where.priceKes || {}), gte: Number(query.minPrice) };
    if (query.maxPrice) where.priceKes = { ...(where.priceKes || {}), lte: Number(query.maxPrice) };
    if (query.search) where.name = { contains: query.search, mode: 'insensitive' };
    
    const products = await this.prisma.product.findMany({ 
      where, 
      include: { images: true, business: true }, 
      orderBy: { createdAt: 'desc' } 
    });

    return products.map((p: any) => ({
      ...p,
      verification: this.verification.validatePrice(p.county, p.category, p.priceKes)
    }));
  }

  async placeOrder(userId: string, dto: PlaceOrderDto) {
    const productIds = dto.items.map((i: any) => i.productId);
    const products = await this.prisma.product.findMany({ where: { id: { in: productIds } } });
    if (products.length !== productIds.length) {
      throw new BadRequestException('Invalid product(s)');
    }

    const unitPriceById = new Map(products.map((p: any) => [p.id, p.priceKes]));
    const totalAmount = dto.items.reduce((sum: number, item: any) => sum + (unitPriceById.get(item.productId) || 0) * item.quantity, 0);

    return this.prisma.order.create({
      data: {
        buyerName: dto.buyerName,
        buyerPhone: dto.buyerPhone ?? null,
        buyerOrganization: dto.buyerOrganization ?? null,
        buyerUserId: userId,
        deliveryLocation: dto.deliveryLocation,
        county: dto.county,
        totalAmount,
        status: OrderStatus.PENDING,
        items: {
          create: dto.items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            unitPrice: unitPriceById.get(i.productId) || 0
          }))
        }
      },
      include: { items: true }
    });
  }

  getOrder(id: string) {
    return this.prisma.order.findUniqueOrThrow({ where: { id }, include: { items: true } });
  }

  async updateOrderStatus(userId: string, orderId: string, status: string) {
    const business = await this.prisma.business.findUnique({ where: { userId } });
    if (!business) throw new BadRequestException('Business profile required');

    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { product: true } } }
    });
    if (!order) throw new BadRequestException('Order not found');

    const ownsAny = order.items.some((i) => i.product.businessId === business.id);
    if (!ownsAny) throw new ForbiddenException('Not allowed');

    if (!Object.values(OrderStatus).includes(status as OrderStatus)) {
      throw new BadRequestException('Invalid status');
    }

    return this.prisma.order.update({ where: { id: orderId }, data: { status: status as OrderStatus } });
  }

  async updateProduct(userId: string, productId: string, dto: UpdateProductDto) {
    const business = await this.prisma.business.findUnique({ where: { userId } });
    if (!business) throw new BadRequestException('Business profile required');
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product || product.businessId !== business.id) throw new ForbiddenException('Not allowed');

    return this.prisma.product.update({
      where: { id: productId },
      data: {
        name: dto.name,
        category: dto.category,
        priceKes: dto.priceKes,
        quantity: dto.quantity,
        unit: dto.unit,
        description: dto.description,
        images: dto.photoUrl
          ? {
              deleteMany: {},
              create: [{ url: dto.photoUrl, sortOrder: 0 }]
            }
          : undefined
      },
      include: { images: true }
    });
  }

  async deleteProduct(userId: string, productId: string) {
    const business = await this.prisma.business.findUnique({ where: { userId } });
    if (!business) throw new BadRequestException('Business profile required');
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product || product.businessId !== business.id) throw new ForbiddenException('Not allowed');
    await this.prisma.productImage.deleteMany({ where: { productId } });
    await this.prisma.review.deleteMany({ where: { productId } });
    return this.prisma.product.delete({ where: { id: productId } });
  }

  listReviews(productId: string) {
    return this.prisma.review.findMany({
      where: { productId },
      select: { id: true, rating: true, comment: true, createdAt: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async createReview(userId: string, productId: string, rating: number, comment?: string) {
    const delivered = await this.prisma.orderItem.count({
      where: { productId, order: { buyerUserId: userId, status: 'DELIVERED' } }
    });
    if (delivered === 0) throw new ForbiddenException('Delivery required to review');

    const cleaned = comment ? this.stripHtml(comment) : undefined;
    return this.prisma.review.create({
      data: { userId, productId, rating, comment: cleaned ?? null },
      select: { id: true, rating: true, comment: true, createdAt: true }
    });
  }
}
