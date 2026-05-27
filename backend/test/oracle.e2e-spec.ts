import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { RedisService } from '../src/common/redis/redis.service';
import { PrismaService } from '../src/common/prisma/prisma.service';

describe('Oracle (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(RedisService)
      .useValue({ get: async () => null, set: async () => undefined, del: async () => undefined })
      .compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api/v1');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/v1/oracle/prices returns price snapshot', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/oracle/prices?product=grains')
      .expect(200);

    expect(res.body.product).toBe('grains');
    expect(res.body.average).toBeGreaterThan(0);
    expect(res.body.currency).toBe('KES');
    expect(res.body.source).toContain('KilimoLink');
  });

  it('GET /api/v1/oracle/prices without product param', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/oracle/prices')
      .expect(200);

    expect(res.body.product).toBe('other');
    expect(res.body.average).toBeGreaterThan(0);
  });

  it('GET /api/v1/oracle/prices handles unknown product', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/oracle/prices?product=unknown_crop')
      .expect(200);

    expect(res.body.average).toBeGreaterThan(0);
  });
});
