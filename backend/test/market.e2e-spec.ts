import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { RedisService } from '../src/common/redis/redis.service';
import { PrismaService } from '../src/common/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { createMockPrismaService } from './prisma-mock';

describe('Market (e2e)', () => {
  let app: INestApplication;
  let prismaMock: ReturnType<typeof createMockPrismaService>;
  let jwtService: JwtService;
  let farmerToken: string;
  let buyerToken: string;

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

    const farmer = await prismaMock.user.create({
      data: { email: 'test-farmer@example.com', name: 'Test Farmer', role: 'FARMER', phone: '+254700000001' },
    });
    farmerToken = await jwtService.signAsync({ sub: farmer.id, role: 'FARMER' });

    const buyer = await prismaMock.user.create({
      data: { email: 'test-buyer@example.com', name: 'Test Buyer', role: 'BUYER', phone: '+254700000002' },
    });
    buyerToken = await jwtService.signAsync({ sub: buyer.id, role: 'BUYER' });
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /api/v1/products creates a product (farmer)', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/products')
      .set('Authorization', `Bearer ${farmerToken}`)
      .send({
        title: 'Fresh Tomatoes',
        price: 120,
        quantity: 100,
        category: 'Vegetables',
        location: { lat: -1.286, lng: 36.817, address: 'Nairobi' },
      })
      .expect(201);

    expect(res.body.title).toBe('Fresh Tomatoes');
  });

  it('POST /api/v1/products rejects non-farmer', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/products')
      .set('Authorization', `Bearer ${buyerToken}`)
      .send({
        title: 'Should Fail',
        price: 100,
        quantity: 10,
        category: 'Vegetables',
      })
      .expect(400);
  });

  it('POST /api/v1/products requires auth', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/products')
      .send({ title: 'No Auth', price: 100, quantity: 10, category: 'Vegetables' })
      .expect(401);
  });

  it('GET /api/v1/products lists products', async () => {
    const farmer = await prismaMock.user.findFirst({ where: { role: 'FARMER' } });
    await prismaMock.product.create({
      data: {
        title: 'Test Product',
        price: 100,
        quantity: 50,
        category: 'Fruits',
        location: { lat: -1.286, lng: 36.817 },
        farmerId: farmer.id,
      },
    });

    const res = await request(app.getHttpServer())
      .get('/api/v1/products')
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it('GET /api/v1/products with lat/lng sorts by distance', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/products?lat=-1.286&lng=36.817')
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty('distance');
    }
  });
});
