import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class MarketService {
  constructor(private readonly prisma: PrismaService) {}

  async createProduct(farmerId: string, dto: any) {
    const user = await this.prisma.user.findUnique({ where: { id: farmerId } });
    if (!user || user.role !== Role.FARMER) {
      throw new BadRequestException('Only farmers can create products');
    }

    return this.prisma.product.create({
      data: {
        title: dto.title,
        description: dto.description,
        price: dto.price,
        quantity: dto.quantity,
        category: dto.category,
        imageUrl: dto.imageUrl,
        location: dto.location,
        farmerId: farmerId,
      },
    });
  }

  async listProducts(lat?: number, lng?: number) {
    const products = await this.prisma.product.findMany({
      include: { farmer: true },
      orderBy: { createdAt: 'desc' },
    });

    if (lat !== undefined && lng !== undefined) {
      return products
        .map((p: any) => {
          const distance = this.calculateDistance(lat, lng, p.location?.lat, p.location?.lng);
          return { ...p, distance };
        })
        .sort((a, b) => (a.distance || 0) - (b.distance || 0));
    }

    return products;
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
