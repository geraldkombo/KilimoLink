import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { RedisService } from '../src/common/redis/redis.service';
import { PrismaService } from '../src/common/prisma/prisma.service';
import { createMockPrismaService } from './prisma-mock';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let prismaMock: ReturnType<typeof createMockPrismaService>;

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

  it('POST /api/v1/auth/login-email creates user and returns token', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/login-email')
      .send({ email: 'test@example.com', name: 'Test User', role: 'FARMER' })
      .expect(201);

    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('test@example.com');
    expect(res.body.user.role).toBe('FARMER');
  });

  it('POST /api/v1/auth/login-email upserts existing user', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/auth/login-email')
      .send({ email: 'dup@example.com', name: 'Original', role: 'FARMER' });

    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/login-email')
      .send({ email: 'dup@example.com', name: 'Updated', role: 'BUYER' })
      .expect(201);

    expect(res.body.user.name).toBe('Updated');
  });

  it('POST /api/v1/auth/otp returns dev code', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/otp')
      .send({ phone: '+254712345678' })
      .expect(201);

    expect(res.body.ok).toBe(true);
    expect(res.body.devCode).toBe('123456');
  });

  it('POST /api/v1/auth/verify returns token', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/verify')
      .send({ phone: '+254712345678', code: '123456' })
      .expect(201);

    expect(res.body.token).toBeDefined();
  });
});
