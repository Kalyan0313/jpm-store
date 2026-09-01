import request from 'supertest';
import app from '../src/app.js';
import { connectTestDB, closeTestDB } from './helpers/db.js';

beforeAll(async () => {
    await connectTestDB();
});

afterAll(async () => {
    await closeTestDB();
});

describe('Swagger / OpenAPI Documentation Tests', () => {
    it('should serve OpenAPI 3.0 JSON specification at /api-docs.json', async () => {
        const res = await request(app).get('/api-docs.json');

        expect(res.status).toBe(200);
        expect(res.body.openapi).toBe('3.0.0');
        expect(res.body.info.title).toBe('JPM Store REST API');
        expect(res.body.paths).toHaveProperty('/products');
        expect(res.body.paths).toHaveProperty('/orders');
        expect(res.body.paths).toHaveProperty('/auth/login');
    });

    it('should redirect or serve Swagger UI at /api-docs', async () => {
        const res = await request(app).get('/api-docs/');
        expect(res.status).toBe(200);
        expect(res.text).toContain('Swagger UI');
    });
});
