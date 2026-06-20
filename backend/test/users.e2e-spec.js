"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const request = require("supertest");
const app_module_1 = require("../src/app.module");
const redis_service_1 = require("../src/common/redis/redis.service");
const prisma_service_1 = require("../src/common/prisma/prisma.service");
const jwt_1 = require("@nestjs/jwt");
const prisma_mock_1 = require("./prisma-mock");
describe('Users (e2e)', () => {
    let app;
    let prismaMock;
    let jwtService;
    let token;
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
        jwtService = app.get(jwt_1.JwtService);
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
//# sourceMappingURL=users.e2e-spec.js.map