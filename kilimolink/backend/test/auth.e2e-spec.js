"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const request = require("supertest");
const app_module_1 = require("../src/app.module");
const redis_service_1 = require("../src/common/redis/redis.service");
const prisma_service_1 = require("../src/common/prisma/prisma.service");
const prisma_mock_1 = require("./prisma-mock");
describe('Auth (e2e)', () => {
    let app;
    let prismaMock;
    beforeAll(async () => {
        prismaMock = (0, prisma_mock_1.createMockPrismaService)();
        const moduleRef = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule],
        })
            .overrideProvider(redis_service_1.RedisService)
            .useValue({ get: async () => null, set: async () => undefined, del: async () => undefined })
            .overrideProvider(prisma_service_1.PrismaService)
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
//# sourceMappingURL=auth.e2e-spec.js.map