"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const config_1 = require("@nestjs/config");
const redis_service_1 = require("../src/common/redis/redis.service");
describe('RedisService (unit)', () => {
    let service;
    beforeEach(async () => {
        process.env.DISABLE_REDIS = 'true';
        const moduleRef = await testing_1.Test.createTestingModule({
            imports: [config_1.ConfigModule.forRoot({ isGlobal: true })],
            providers: [redis_service_1.RedisService],
        }).compile();
        service = moduleRef.get(redis_service_1.RedisService);
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
    let service;
    beforeEach(async () => {
        delete process.env.DISABLE_REDIS;
        const moduleRef = await testing_1.Test.createTestingModule({
            imports: [config_1.ConfigModule.forRoot({ isGlobal: true })],
            providers: [redis_service_1.RedisService],
        }).compile();
        service = moduleRef.get(redis_service_1.RedisService);
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
//# sourceMappingURL=redis-service.spec.js.map