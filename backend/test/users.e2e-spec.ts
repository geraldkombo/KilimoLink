import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { RedisService } from '../src/common/redis/redis.service';
import { PrismaService } from '../src/common/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { createMockPrismaService } from './prisma-mock';

describe('Users (e2e)', () => {
  let app: INestApplication;
  let prismaMock: ReturnType<typeof createMockPrismaService>;
  let jwtService: JwtService;
  let token: string;

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

    const user = await prismaMock.user.create({
      data: { email: 'test-user@example.com', name: 'Test User', role: 'BUYER' },
    });
    token = await jwtService.signAsync({ sub: user.id, role: 'BUYER' });
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/v1/users/me returns current user', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/users/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.email).toBe('test-user@example.com');
    expect(res.body.name).toBe('Test User');
  });

  it('GET /api/v1/users/me requires auth', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/users/me')
      .expect(401);
  });

  it('DELETE /api/v1/users/me deletes current user', async () => {
    const res = await request(app.getHttpServer())
      .delete('/api/v1/users/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.ok).toBe(true);
  });

  it('GET /api/v1/users/me returns 500 after deletion', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/users/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(500);
  });
});
