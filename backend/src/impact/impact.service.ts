import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { OrderStatus, Role } from '@prisma/client';

@Injectable()
export class ImpactService {
  constructor(private readonly prisma: PrismaService) {}

  async getMetrics() {
    const completedOrdersCount = await this.prisma.order.count({
      where: { status: OrderStatus.DELIVERED },
    });

    const products = await this.prisma.product.findMany({
      include: {
        orderItems: {
          where: { order: { status: OrderStatus.DELIVERED } },
        },
      },
    });

    let totalSoldQuantity = 0;
    let totalInitialQuantity = 0;

    products.forEach((p) => {
      const sold = p.orderItems.reduce((sum, item) => sum + item.quantity, 0);
      totalSoldQuantity += sold;
      totalInitialQuantity += p.quantity + sold;
    });

    const wasteDivertedKg = (totalInitialQuantity - totalSoldQuantity) * 0.5;
    const co2SavedKg = (completedOrdersCount * 5 * 0.2) + (wasteDivertedKg * 2.5);

    const distinctFarmersCount = await this.prisma.user.count({
      where: { role: Role.FARMER },
    });
    const greenSpaceM2 = distinctFarmersCount * 100;

    return {
      co2SavedKg: Math.round(co2SavedKg * 100) / 100,
      wasteDivertedKg: Math.round(wasteDivertedKg * 100) / 100,
      greenSpaceM2,
      completedOrders: completedOrdersCount,
      activeFarmers: distinctFarmersCount,
    };
  }
}
