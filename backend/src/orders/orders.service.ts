import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(buyerId: string, dto: any) {
    const product = await this.prisma.product.findUnique({ where: { id: dto.productId } });
    if (!product) {
      throw new BadRequestException('Product not found');
    }

    if (product.quantity < dto.quantity) {
      throw new BadRequestException('Not enough quantity available');
    }

    const totalAmount = product.price * dto.quantity;
    const isMock = process.env.MOCK_PAYMENTS === 'true';

    const order = await this.prisma.order.create({
      data: {
        buyerId,
        totalAmount,
        status: isMock ? OrderStatus.CONFIRMED : OrderStatus.PENDING,
        paymentMethod: isMock ? 'MOCK' : dto.paymentMethod || 'CASH',
        items: {
          create: [
            {
              productId: dto.productId,
              quantity: dto.quantity,
              price: product.price,
            },
          ],
        },
      },
    });

    // Update product quantity
    await this.prisma.product.update({
      where: { id: dto.productId },
      data: { quantity: { decrement: dto.quantity } },
    });

    return { success: true, orderId: order.id };
  }

  async getUserOrders(userId: string) {
    return this.prisma.order.findMany({
      where: {
        OR: [
          { buyerId: userId },
          { items: { some: { product: { farmerId: userId } } } },
        ],
      },
      include: {
        items: {
          include: { product: true },
        },
        buyer: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
