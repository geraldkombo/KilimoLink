import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { RedisService } from '../src/common/redis/redis.service';
import { PrismaService } from '../src/common/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { createMockPrismaService } from './prisma-mock';

describe('Admin (e2e)', () => {
  let app: INestApplication;
  let prismaMock: ReturnType<typeof createMockPrismaService>;
  let jwtService: JwtService;
  let adminToken: string;
  let adminId: string;

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

    const adminUser = await prismaMock.adminUser.create({
      data: {
        email: 'test-admin@example.com',
        passwordHash: await bcrypt.hash('Admin@123', 10),
        role: 'ADMIN',
      },
    });
    adminId = adminUser.id;
    adminToken = await jwtService.signAsync({ sub: adminUser.id, role: 'ADMIN' });

    const farmer = await prismaMock.user.create({
      data: { email: 'test-farmer2@example.com', name: 'Seed Farmer', role: 'FARMER' },
    });

    await prismaMock.product.create({
      data: {
        title: 'Admin Test Product',
        price: 200,
        quantity: 30,
        category: 'Fruits',
        location: { lat: -1.286, lng: 36.817 },
        farmerId: farmer.id,
      },
    });
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/v1/admin/impact returns metrics', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/admin/impact')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(res.body).toHaveProperty('completedOrders');
    expect(res.body).toHaveProperty('co2SavedKg');
    expect(res.body).toHaveProperty('wasteDivertedKg');
    expect(res.body).toHaveProperty('greenSpaceM2');
  });

  it('GET /api/v1/admin/users lists users', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/admin/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/v1/admin/products lists products', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/admin/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it('GET /api/v1/admin/resilience returns logs', async () => {
    await prismaMock.resilienceLog.create({
      data: { type: 'MARKET_SHIFT', title: 'Test Alert', description: 'Test', impact: 'NEUTRAL', status: 'MONITORED' },
    });

    const res = await request(app.getHttpServer())
      .get('/api/v1/admin/resilience')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/v1/admin/resilience creates log', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/admin/resilience')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ type: 'EXPERIMENT', title: 'Test', description: 'Desc', impact: 'POSITIVE', status: 'IN_PROGRESS' })
      .expect(201);

    expect(res.body.title).toBe('Test');
  });

  it('POST /api/v1/admin/auth/login authenticates admin', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/admin/auth/login')
      .send({ email: 'test-admin@example.com', password: 'Admin@123' })
      .expect(201);

    expect(res.body.token).toBeDefined();
  });

  it('POST /api/v1/admin/auth/login rejects bad password', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/admin/auth/login')
      .send({ email: 'test-admin@example.com', password: 'wrong' })
      .expect(401);
  });

  it('admin endpoints reject non-admin', async () => {
    const userToken = await jwtService.signAsync({ sub: 'some-user', role: 'BUYER' });

    await request(app.getHttpServer())
      .get('/api/v1/admin/impact')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(403);
  });

  it('DELETE /api/v1/admin/products/:id deletes product', async () => {
    const product = await prismaMock.product.findFirst();
    if (product) {
      await request(app.getHttpServer())
        .delete(`/api/v1/admin/products/${product.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
    }
  });

  it('GET /api/v1/admin/audit-logs returns logs', async () => {
    await prismaMock.auditLog.create({
      data: { adminId, action: 'TEST', entityType: 'product', payload: {} },
    });

    const res = await request(app.getHttpServer())
      .get('/api/v1/admin/audit-logs')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
  });
});
