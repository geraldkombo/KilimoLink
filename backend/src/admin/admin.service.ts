import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { OrderStatus, Role } from '@prisma/client';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getImpactMetrics() {
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
      totalInitialQuantity += p.quantity + sold; // Current quantity + what was sold
    });

    const wasteDivertedKg = (totalInitialQuantity - totalSoldQuantity) * 0.5;
    const co2SavedKg = (completedOrdersCount * 5 * 0.2) + (wasteDivertedKg * 2.5);

    const distinctFarmersCount = await this.prisma.user.count({
      where: { role: Role.FARMER },
    });
    const greenSpaceM2 = distinctFarmersCount * 100;

    return {
      completedOrders: completedOrdersCount,
      co2SavedKg,
      wasteDivertedKg,
      greenSpaceM2,
    };
  }

  async listUsers() {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async listProducts() {
    return this.prisma.product.findMany({
      include: { farmer: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteProduct(id: string) {
    return this.prisma.product.delete({ where: { id } });
  }

  async deleteUser(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }

  async listResilienceLogs() {
    return this.prisma.resilienceLog.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async createResilienceLog(dto: any) {
    return this.prisma.resilienceLog.create({
      data: dto,
    });
  }

  async listAuditLogs(adminId: string) {
    return this.prisma.auditLog.findMany({
      where: { adminId },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  async seedDemoData() {
    try {
      const productsPath = join(process.cwd(), 'prisma', 'seed_data', 'products.json');
      const businessesPath = join(process.cwd(), 'prisma', 'seed_data', 'businesses.json');

      const productsRaw = await readFile(productsPath, 'utf-8');
      const businessesRaw = await readFile(businessesPath, 'utf-8');

      const productsData = JSON.parse(productsRaw);
      const businessesData = JSON.parse(businessesRaw);

      // Map to store phone -> userId for linking products
      const phoneToUserId = new Map<string, string>();

      // Seed Users and Businesses based on the provided dataset
      for (const biz of businessesData) {
        const email = `${biz.phone.replace('+', '')}@kilimolink.demo`;
        const user = await this.prisma.user.upsert({
          where: { email },
          update: {},
          create: {
            email,
            name: `${biz.sector} Provider (${biz.county})`,
            role: Role.FARMER,
            phone: biz.phone,
          },
        });
        phoneToUserId.set(biz.phone, user.id);
      }

      // Default farmer if sellerPhone doesn't match
      const defaultFarmer = await this.prisma.user.upsert({
        where: { email: 'admin@kilimolink.demo' },
        update: {},
        create: {
          email: 'admin@kilimolink.demo',
          name: 'KilimoLink Admin',
          role: Role.ADMIN,
          phone: '+254000000000',
        },
      });

      // Seed Products from the official JSON dataset
      for (const p of productsData) {
        const farmerId = phoneToUserId.get(p.sellerPhone) || defaultFarmer.id;
        
        // Nairobi-centric mock coordinates if none exist in dataset
        const mockLocations: Record<string, { lat: number, lng: number, address: string }> = {
          'vegetables': { lat: -1.313, lng: 36.788, address: 'Kibera Urban Gardens' },
          'dairy': { lat: -1.102, lng: 36.643, address: 'Limuru Peri-Urban' },
          'staples': { lat: -1.286, lng: 36.817, address: 'Nairobi Central Millers' },
          'poultry': { lat: -1.233, lng: 36.666, address: 'Kikuyu Poultry Hub' },
          'traditional': { lat: -1.250, lng: 36.800, address: 'Westlands Community Garden' }
        };

        const loc = mockLocations[p.category.toLowerCase()] || { lat: -1.286389, lng: 36.817223, address: 'Nairobi Hub' };

        await this.prisma.product.create({
          data: {
            title: p.name,
            description: p.description,
            price: p.priceKes,
            quantity: p.quantity,
            category: p.category.charAt(0).toUpperCase() + p.category.slice(1),
            imageUrl: `https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80`, // Generic agri image
            location: { lat: loc.lat, lng: loc.lng, address: loc.address },
            farmerId: farmerId,
          },
        });
      }

      return { success: true, message: `Successfully seeded ${productsData.length} products from official datasets.` };
    } catch (error) {
      console.error('Seeding failed:', error);
      throw new Error('Failed to seed from datasets: ' + error.message);
    }
  }
}
