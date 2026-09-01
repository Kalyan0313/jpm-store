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

describe('Concurrent Order & Atomic Inventory Concurrency Tests', () => {
    it('should prevent overselling when multiple concurrent users attempt to buy the last in-stock item', async () => {
        // 1) Seed a rare product with exactly stock = 1
        const product = await Product.create({
            title: 'Limited Edition Gaming Console',
            description: 'Only 1 unit available in entire stock',
            price: 499,
            category: 'smartwatches',
            brand: 'RareTech',
            stock: 1,
            thumbnail: 'https://example.com/console.jpg',
        });

        // 2) Create two distinct authenticated users (User A and User B)
        const userARes = await request(app).post('/api/v1/auth/register').send({
            name: 'User A',
            email: 'usera@example.com',
            password: 'Password123!',
        });
        const userBRes = await request(app).post('/api/v1/auth/register').send({
            name: 'User B',
            email: 'userb@example.com',
            password: 'Password123!',
        });

        expect(userARes.status).toBe(201);
        expect(userBRes.status).toBe(201);

        const tokenA = userARes.body.token;
        const tokenB = userBRes.body.token;

        const orderPayload = {
            orderItems: [{ product: product._id.toString(), quantity: 1 }],
            shippingAddress: {
                fullName: 'Rush Buyer',
                street: '456 Fast Lane',
                city: 'Bengaluru',
                state: 'Karnataka',
                postalCode: '560001',
                phone: '+91 9988776655',
            },
            paymentMethod: 'COD',
        };

        // 3) Fire concurrent checkout requests at the exact same moment
        const [resA, resB] = await Promise.all([
            request(app)
                .post('/api/v1/orders')
                .set('Authorization', `Bearer ${tokenA}`)
                .send(orderPayload),
            request(app)
                .post('/api/v1/orders')
                .set('Authorization', `Bearer ${tokenB}`)
                .send(orderPayload),
        ]);

        // 4) Assert: Exactly one order succeeds (201 Created) and one fails (400 Insufficient Stock)
        const statuses = [resA.status, resB.status];
        const successCount = statuses.filter((s) => s === 201).length;
        const failureCount = statuses.filter((s) => s === 400).length;

        expect(successCount).toBe(1);
        expect(failureCount).toBe(1);

        // Verify the failed response contains the proper error message
        const failedResponse = resA.status === 400 ? resA : resB;
        expect(failedResponse.body.status).toBe('fail');
        expect(failedResponse.body.message).toMatch(/insufficient stock/i);

        // 5) Verify final stock in MongoDB is exactly 0 and NEVER negative
        const finalProduct = await Product.findById(product._id);
        expect(finalProduct.stock).toBe(0);
    });
});
