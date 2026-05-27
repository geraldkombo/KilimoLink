import { Test } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisService } from '../src/common/redis/redis.service';

describe('RedisService (unit)', () => {
  let service: RedisService;

  beforeEach(async () => {
    process.env.DISABLE_REDIS = 'true';

    const moduleRef = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true })],
      providers: [RedisService],
    }).compile();

    service = moduleRef.get(RedisService);
    await service.onModuleInit();
  });

  it('gracefully handles disabled Redis', async () => {
    const val = await service.get('test-key');
    expect(val).toBeNull();
  });

  it('set does not throw when Redis disabled', async () => {
    await expect(service.set('key', 'value')).resolves.toBeUndefined();
  });

  it('del does not throw when Redis disabled', async () => {
    await expect(service.del('key')).resolves.toBeUndefined();
  });

  it('set with TTL does not throw when disabled', async () => {
    await expect(service.set('key', 'value', 300)).resolves.toBeUndefined();
  });
});

describe('RedisService with mock client (unit)', () => {
  let service: RedisService;

  beforeEach(async () => {
    delete process.env.DISABLE_REDIS;

    const moduleRef = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true })],
      providers: [RedisService],
    }).compile();

    service = moduleRef.get(RedisService);
    service['isAvailable'] = false;
  });

  it('get returns null when unavailable', async () => {
    expect(await service.get('key')).toBeNull();
  });

  it('set does not throw when unavailable', async () => {
    await expect(service.set('key', 'value')).resolves.toBeUndefined();
  });

  it('del does not throw when unavailable', async () => {
    await expect(service.del('key')).resolves.toBeUndefined();
  });
});
