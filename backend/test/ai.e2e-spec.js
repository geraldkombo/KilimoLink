"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const request = require("supertest");
const app_module_1 = require("../src/app.module");
const redis_service_1 = require("../src/common/redis/redis.service");
const jwt_1 = require("@nestjs/jwt");
const ai_service_1 = require("../src/ai/ai.service");
describe('AI Price Suggestion (e2e)', () => {
    let app;
    let jwtService;
    let token;
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
        jwtService = app.get(jwt_1.JwtService);
        token = await jwtService.signAsync({ sub: 'test-user', role: 'FARMER' });
    });
    afterAll(async () => {
        await app.close();
    });
    it('POST /api/v1/ai/suggest-price returns price range', async () => {
        const res = await request(app.getHttpServer())
            .post('/api/v1/ai/suggest-price')
            .set('Authorization', `Bearer ${token}`)
            .send({ productName: 'Organic Tomatoes', category: 'Vegetables', recentPrices: [80, 90, 100] })
            .expect(201);
        expect(res.body.recommended).toBeDefined();
        expect(res.body.min).toBeDefined();
        expect(res.body.max).toBeDefined();
        expect(typeof res.body.recommended).toBe('number');
        expect(res.body.min).toBeLessThanOrEqual(res.body.recommended);
        expect(res.body.max).toBeGreaterThanOrEqual(res.body.recommended);
    });
    it('POST /api/v1/ai/suggest-price requires auth', async () => {
        await request(app.getHttpServer())
            .post('/api/v1/ai/suggest-price')
            .send({ productName: 'Tomatoes', category: 'Vegetables' })
            .expect(401);
    });
    it('POST /api/v1/ai/suggest-price handles empty recentPrices', async () => {
        const res = await request(app.getHttpServer())
            .post('/api/v1/ai/suggest-price')
            .set('Authorization', `Bearer ${token}`)
            .send({ productName: 'Milk', category: 'Dairy', recentPrices: [] })
            .expect(201);
        expect(res.body.recommended).toBeDefined();
    });
});
describe('AiService (unit)', () => {
    let aiService;
    beforeAll(() => {
        aiService = new ai_service_1.AiService();
    });
    it('adjusts premium product prices upward', async () => {
        const result = await aiService.suggestPrice('Organic Premium Kale', 'Vegetables', [90]);
        expect(result.recommended).toBeGreaterThan(90);
    });
    it('adjusts bulk product prices downward', async () => {
        const result = await aiService.suggestPrice('Bulk Wholesale Maize', 'Grains', [80]);
        expect(result.recommended).toBeLessThan(80 * 1.25);
    });
    it('uses category baseline when no recent prices', async () => {
        const result = await aiService.suggestPrice('Unknown Item', 'Dairy', []);
        expect(result.recommended).toBeGreaterThan(0);
    });
    it('falls back to default baseline for unknown category', async () => {
        const result = await aiService.suggestPrice('Weird Item', 'UnknownCategory', []);
        expect(result.recommended).toBeGreaterThan(0);
    });
});
//# sourceMappingURL=ai.e2e-spec.js.map