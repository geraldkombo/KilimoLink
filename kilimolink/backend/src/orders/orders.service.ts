import { Injectable, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { OrderStatus } from '@prisma/client';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(buyerId: string, dto: CreateOrderDto) {
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

  async completeOrder(userId: string, orderId: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');
    if (order.buyerId !== userId) throw new ForbiddenException('You can only complete your own orders');

    const updated = await this.prisma.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.DELIVERED },
    });
    return { success: true, orderId: order.id, status: updated.status };
  }

  async getUserOrders(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where: {
          OR: [
            { buyerId: userId },
            { items: { some: { product: { farmerId: userId } } } },
          ],
        },
        skip,
        take: limit,
        include: {
          items: {
            include: {
              product: {
                include: { farmer: true },
              },
            },
          },
          buyer: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count({
        where: {
          OR: [
            { buyerId: userId },
            { items: { some: { product: { farmerId: userId } } } },
          ],
        },
      }),
    ]);
    return { orders, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}
