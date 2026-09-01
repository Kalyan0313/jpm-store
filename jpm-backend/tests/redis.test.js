import request from 'supertest';
import app from '../src/app.js';
import { connectTestDB, closeTestDB, clearTestDB } from './helpers/db.js';
import { Product } from '../src/models/Product.js';

beforeAll(async () => {
    await connectTestDB();
});

afterAll(async () => {
    await closeTestDB();
});

afterEach(async () => {
    await clearTestDB();
});

describe('Redis & Resilience Integration Tests', () => {
    describe('GET /api/v1/health', () => {
        it('should return 200 OK and report database and redis service status', async () => {
            const res = await request(app).get('/api/v1/health');

            expect(res.status).toBe(200);
            expect(res.body.status).toBe('success');
            expect(res.body.services).toBeDefined();
            expect(res.body.services.database).toBe('connected');
            expect(res.body.services.redis).toBeDefined();
        });
    });

    describe('Graceful Fallback on Cache MISS / Disconnected Cache', () => {
        it('should seamlessly query MongoDB when Redis is not running without crashing', async () => {
            await Product.create({
                title: 'Graceful Fallback Laptop',
                description: 'Tests seamless database querying',
                price: 1200,
                category: 'laptops',
                brand: 'FallbackBrand',
                stock: 10,
                thumbnail: 'https://example.com/fallback.jpg',
            });

            const res = await request(app).get('/api/v1/products?category=laptops');

            expect(res.status).toBe(200);
            expect(res.body.status).toBe('success');
            expect(res.body.results).toBe(1);
            expect(res.body.data.products[0].title).toBe('Graceful Fallback Laptop');
        });
    });
});
