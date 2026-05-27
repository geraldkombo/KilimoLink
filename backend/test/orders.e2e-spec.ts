import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { RedisService } from '../src/common/redis/redis.service';
import { PrismaService } from '../src/common/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { createMockPrismaService } from './prisma-mock';

describe('Orders (e2e)', () => {
  let app: INestApplication;
  let prismaMock: ReturnType<typeof createMockPrismaService>;
  let jwtService: JwtService;
  let farmerToken: string;
  let buyerToken: string;
  let productId: string;

  beforeAll(async () => {
    prismaMock = createMockPrismaService();

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(RedisService)
      .useValue({ get: async () => null, set: async () => undefined, del: async () => undefined })
      .overrideProvider(PrismaService)
      .useValue(prismaMock)
      .compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api/v1');
    await app.init();
    jwtService = app.get(JwtService);

    process.env.MOCK_PAYMENTS = 'true';

    const farmer = await prismaMock.user.create({
      data: { email: 'test-farmer-orders@example.com', name: 'Order Farmer', role: 'FARMER' },
    });
    farmerToken = await jwtService.signAsync({ sub: farmer.id, role: 'FARMER' });

    const buyer = await prismaMock.user.create({
      data: { email: 'test-buyer-orders@example.com', name: 'Order Buyer', role: 'BUYER' },
    });
    buyerToken = await jwtService.signAsync({ sub: buyer.id, role: 'BUYER' });

    const product = await prismaMock.product.create({
      data: {
        title: 'Orderable Product',
        price: 100,
        quantity: 50,
        category: 'Vegetables',
        location: { lat: -1.286, lng: 36.817 },
        farmerId: farmer.id,
      },
    });
    productId = product.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /api/v1/orders creates order with MOCK payment', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/orders')
      .set('Authorization', `Bearer ${buyerToken}`)
      .send({ productId, quantity: 2 })
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.orderId).toBeDefined();
  });

  it('POST /api/v1/orders fails without auth', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/orders')
      .send({ productId, quantity: 2 })
      .expect(401);
  });

  it('POST /api/v1/orders fails for insufficient quantity', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/orders')
      .set('Authorization', `Bearer ${buyerToken}`)
      .send({ productId, quantity: 999 })
      .expect(400);
  });

  it('POST /api/v1/orders fails for nonexistent product', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/orders')
      .set('Authorization', `Bearer ${buyerToken}`)
      .send({ productId: 'nonexistent', quantity: 1 })
      .expect(400);
  });

  it('GET /api/v1/orders returns user orders', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/orders')
      .set('Authorization', `Bearer ${buyerToken}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
  });
});
