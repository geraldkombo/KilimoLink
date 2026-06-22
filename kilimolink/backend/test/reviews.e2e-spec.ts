import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { RedisService } from '../src/common/redis/redis.service';
import { PrismaService } from '../src/common/prisma/prisma.service';
import { createMockPrismaService } from './prisma-mock';

describe('Reviews (e2e)', () => {
  let app: INestApplication;
  let prismaMock: ReturnType<typeof createMockPrismaService>;
  let buyerToken: string;
  let farmerToken: string;
  let productId: string;
  let buyerId: string;

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
  });

  afterAll(async () => {
    await app.close();
  });

  it('register buyer and farmer', async () => {
    const buyerRes = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({ email: 'review-buyer@test.com', password: 'Pass123!', name: 'Review Buyer', role: 'BUYER' })
      .expect(201);

    buyerToken = buyerRes.body.token;
    buyerId = buyerRes.body.user.id;

    const farmerRes = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({ email: 'review-farmer@test.com', password: 'Pass123!', name: 'Review Farmer', role: 'FARMER' })
      .expect(201);

    farmerToken = farmerRes.body.token;
  });

  it('farmer creates a product', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/products')
      .set('Authorization', `Bearer ${farmerToken}`)
      .send({ title: 'Review Test Product', price: 100, quantity: 10, category: 'Vegetables' })
      .expect(201);

    productId = res.body.id;
    expect(productId).toBeDefined();
  });

  it('buyer creates a delivered order', async () => {
    const orderRes = await request(app.getHttpServer())
      .post('/api/v1/orders')
      .set('Authorization', `Bearer ${buyerToken}`)
      .send({ productId, quantity: 1, paymentMethod: 'CASH' })
      .expect(201);

    const orderId = orderRes.body.orderId;

    // Manually set order to DELIVERED in the mock store
    const storeOrder = prismaMock.order as any;
    const stored = await storeOrder.findUnique({ where: { id: orderId } });
    if (stored) {
      stored.status = 'DELIVERED';
    }
  });

  it('POST /api/v1/reviews creates review for eligible buyer', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/reviews')
      .set('Authorization', `Bearer ${buyerToken}`)
      .send({ productId, rating: 5, comment: 'Great product!' })
      .expect(201);

    expect(res.body.rating).toBe(5);
    expect(res.body.comment).toBe('Great product!');
  });

  it('POST /api/v1/reviews returns 403 for duplicate review', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/reviews')
      .set('Authorization', `Bearer ${buyerToken}`)
      .send({ productId, rating: 4 })
      .expect(403);
  });

  it('POST /api/v1/reviews returns 403 for buyer without delivered order', async () => {
    // Register a new buyer with no delivered order
    const newBuyerRes = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({ email: 'no-order-buyer@test.com', password: 'Pass123!', role: 'BUYER' })
      .expect(201);

    await request(app.getHttpServer())
      .post('/api/v1/reviews')
      .set('Authorization', `Bearer ${newBuyerRes.body.token}`)
      .send({ productId, rating: 3 })
      .expect(403);
  });

  it('GET /api/v1/products/:id/reviews returns reviews with aggregate', async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/v1/products/${productId}/reviews`)
      .expect(200);

    expect(res.body.avgRating).toBe(5);
    expect(res.body.reviewCount).toBeGreaterThanOrEqual(1);
    expect(Array.isArray(res.body.reviews)).toBe(true);
  });

  it('GET /api/v1/products/:id includes avgRating and reviewCount', async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/v1/products/${productId}`)
      .expect(200);

    expect(res.body.avgRating).toBeDefined();
    expect(res.body.reviewCount).toBeDefined();
  });
});
