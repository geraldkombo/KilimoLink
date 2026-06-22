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

  it('POST /api/v1/auth/register creates user and returns token', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({ email: 'new@test.com', password: 'Pass123!', name: 'New User', role: 'FARMER' })
      .expect(201);

    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('new@test.com');
    expect(res.body.user.role).toBe('FARMER');
  });

  it('POST /api/v1/auth/register rejects duplicate email', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({ email: 'dup@test.com', password: 'Pass123!' });

    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({ email: 'dup@test.com', password: 'Pass123!' })
      .expect(409);
  });

  it('POST /api/v1/auth/login returns token for registered user', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({ email: 'login@test.com', password: 'Pass123!' });

    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'login@test.com', password: 'Pass123!' })
      .expect(201);

    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('login@test.com');
  });

  it('POST /api/v1/auth/login returns 401 for wrong password', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({ email: 'wrongpw@test.com', password: 'Pass123!' });

    await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'wrongpw@test.com', password: 'WrongPass1' })
      .expect(401);
  });

  it('POST /api/v1/auth/login returns 404 for unregistered email', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'nonexistent@test.com', password: 'Pass123!' })
      .expect(404);
  });

  it('POST /api/v1/auth/otp returns ok in dev mode with devCode', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/otp')
      .send({ phone: '+254712345678' })
      .expect(201);

    expect(res.body.ok).toBe(true);
    expect(res.body.devCode).toBeDefined();
  });

  it('POST /api/v1/auth/verify returns token with valid OTP', async () => {
    const otpRes = await request(app.getHttpServer())
      .post('/api/v1/auth/otp')
      .send({ phone: '+254700000001' });

    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/verify')
      .send({ phone: '+254700000001', code: otpRes.body.devCode })
      .expect(201);

    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('+254700000001@sms.kilimolink');
  });

  it('POST /api/v1/auth/verify returns 401 with wrong code', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/auth/otp')
      .send({ phone: '+254700000002' });

    await request(app.getHttpServer())
      .post('/api/v1/auth/verify')
      .send({ phone: '+254700000002', code: '000000' })
      .expect(401);
  });

  it('GET /api/v1/auth/me returns user when authenticated', async () => {
    const regRes = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({ email: 'me@test.com', password: 'Pass123!' });

    const token = regRes.body.token;

    const res = await request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body).toBeDefined();
  });

  it('GET /api/v1/auth/me returns 401 without token', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .expect(401);
  });

  it('POST /api/v1/auth/login-email still works (backward compat)', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/login-email')
      .send({ email: 'legacy@test.com', name: 'Legacy', role: 'FARMER' })
      .expect(201);

    expect(res.body.token).toBeDefined();
  });
});
