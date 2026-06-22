import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { RedisService } from '../src/common/redis/redis.service';
import { PrismaService } from '../src/common/prisma/prisma.service';
import { createMockPrismaService } from './prisma-mock';

describe('Chat (e2e)', () => {
  let app: INestApplication;
  let prismaMock: ReturnType<typeof createMockPrismaService>;
  let user1Token: string;
  let user2Token: string;

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

  it('register two users', async () => {
    const res1 = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({ email: 'chat-user1@test.com', password: 'Pass123!', name: 'Chat User 1', role: 'FARMER' })
      .expect(201);

    user1Token = res1.body.token;

    const res2 = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({ email: 'chat-user2@test.com', password: 'Pass123!', name: 'Chat User 2', role: 'BUYER' })
      .expect(201);

    user2Token = res2.body.token;
  });

  it('POST /api/v1/chat/messages sends a message', async () => {
    const meRes = await request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${user2Token}`);

    const user2Id = meRes.body.userId;

    const me1Res = await request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${user1Token}`);

    const res = await request(app.getHttpServer())
      .post('/api/v1/chat/messages')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({ receiverId: user2Id, text: 'Hello from User 1' })
      .expect(201);

    expect(res.body.text).toBe('Hello from User 1');
    expect(res.body.senderId).toBe(me1Res.body.userId);
  });

  it('GET /api/v1/chat/conversations returns conversations', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/chat/conversations')
      .set('Authorization', `Bearer ${user1Token}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it('GET /api/v1/chat/messages/:userId returns thread', async () => {
    const meRes = await request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${user2Token}`);

    const user2Id = meRes.body.userId;

    const res = await request(app.getHttpServer())
      .get(`/api/v1/chat/messages/${user2Id}`)
      .set('Authorization', `Bearer ${user1Token}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/v1/chat/messages requires auth', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/chat/messages')
      .send({ receiverId: 'some-id', text: 'test' })
      .expect(401);
  });

  it('GET /api/v1/chat/conversations requires auth', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/chat/conversations')
      .expect(401);
  });
});
