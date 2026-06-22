import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateReviewDto) {
    const order = await this.prisma.order.findFirst({
      where: {
        buyerId: userId,
        status: 'DELIVERED',
        items: { some: { productId: dto.productId } },
      },
    });

    if (!order) {
      throw new ForbiddenException(
        'You must have a delivered order for this product to review it',
      );
    }

    const existing = await this.prisma.review.findUnique({
      where: { productId_buyerId: { productId: dto.productId, buyerId: userId } },
    });

    if (existing) {
      throw new ForbiddenException('You have already reviewed this product');
    }

    return this.prisma.review.create({
      data: {
        productId: dto.productId,
        buyerId: userId,
        rating: dto.rating,
        comment: dto.comment,
      },
      include: { buyer: { select: { id: true, name: true } } },
    });
  }

  async getProductReviews(productId: string) {
    const [reviews, aggregate] = await Promise.all([
      this.prisma.review.findMany({
        where: { productId },
        include: { buyer: { select: { id: true, name: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.review.aggregate({
        where: { productId },
        _avg: { rating: true },
        _count: true,
      }),
    ]);

    return {
      avgRating: aggregate._avg.rating ?? 0,
      reviewCount: aggregate._count,
      reviews,
    };
  }
}
