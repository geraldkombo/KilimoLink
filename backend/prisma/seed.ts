import { PrismaClient } from '@prisma/client';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function readJson<T>(fileName: string): Promise<T> {
  const raw = await readFile(join(__dirname, 'seed_data', fileName), 'utf-8');
  return JSON.parse(raw) as T;
}

async function main() {
  const businesses = await readJson<
    Array<{
      phone: string;
      youthLed: boolean;
      womenLed: boolean;
      businessType: 'CROPS' | 'LIVESTOCK' | 'VALUE_ADDITION';
      sector: string;
      county: string;
      businessSize: string;
    }>
  >('businesses.json');

  const products = await readJson<
    Array<{
      sellerPhone: string;
      name: string;
      category: string;
      priceKes: number;
      quantity: number;
      unit: string;
      description: string;
      photoUrl?: string;
    }>
  >('products.json');

  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.adminLoginThrottle.deleteMany();
  await prisma.business.deleteMany();
  await prisma.otpChallenge.deleteMany();
  await prisma.otpVerifyThrottle.deleteMany();
  await prisma.user.deleteMany();
  await prisma.adminUser.deleteMany();

  const userByPhone = new Map<string, { id: string; businessId: string }>();

  for (const b of businesses) {
    const u = await prisma.user.create({
      data: {
        phone: b.phone,
        business: {
          create: {
            youthLed: b.youthLed,
            womenLed: b.womenLed,
            businessType: b.businessType,
            sector: b.sector,
            county: b.county,
            businessSize: b.businessSize
          }
        }
      },
      include: { business: true }
    });
    if (u.business) userByPhone.set(b.phone, { id: u.id, businessId: u.business.id });
  }

  for (const p of products) {
    const seller = userByPhone.get(p.sellerPhone);
    if (!seller) continue;
    await prisma.product.create({
      data: {
        businessId: seller.businessId,
        name: p.name,
        category: p.category,
        priceKes: p.priceKes,
        quantity: p.quantity,
        unit: p.unit,
        description: p.description,
        county: (await prisma.business.findUniqueOrThrow({ where: { id: seller.businessId } })).county,
        images: p.photoUrl ? { create: [{ url: p.photoUrl, sortOrder: 0 }] } : undefined
      }
    });
  }

  const adminPasswordHash = await bcrypt.hash('KilimoLink2026!', 12);
  await prisma.adminUser.create({
    data: {
      email: 'shikunyi@proton.me',
      passwordHash: adminPasswordHash,
      role: 'SUPER_ADMIN'
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    await prisma.$disconnect();
    throw e;
  });
