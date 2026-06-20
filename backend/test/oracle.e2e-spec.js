"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const request = require("supertest");
const app_module_1 = require("../src/app.module");
const redis_service_1 = require("../src/common/redis/redis.service");
describe('Oracle (e2e)', () => {
    let app;
    beforeAll(async () => {
        const moduleRef = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule],
        })
            .overrideProvider(redis_service_1.RedisService)
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
//# sourceMappingURL=oracle.e2e-spec.js.map