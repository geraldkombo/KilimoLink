"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const request = require("supertest");
const app_module_1 = require("../src/app.module");
const redis_service_1 = require("../src/common/redis/redis.service");
const prisma_service_1 = require("../src/common/prisma/prisma.service");
const prisma_mock_1 = require("./prisma-mock");
describe('Health (e2e)', () => {
    let app;
    beforeAll(async () => {
        const moduleRef = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule]
        })
            .overrideProvider(redis_service_1.RedisService)
            .useValue({
            get: async (_key) => null,
            set: async (_k, _v, _t) => undefined,
            del: async (_k) => undefined,
        })
            .overrideProvider(prisma_service_1.PrismaService)
            .useValue((0, prisma_mock_1.createMockPrismaService)())
            .compile();
        app = moduleRef.createNestApplication();
        app.setGlobalPrefix('api/v1');
        await app.init();
    });
    afterAll(async () => {
        await app.close();
    });
    it('GET /api/v1/health returns ok', async () => {
        const res = await request(app.getHttpServer()).get('/api/v1/health').expect(200);
        expect(res.body.status).toBe('ok');
    });
});
//# sourceMappingURL=health.e2e-spec.js.map