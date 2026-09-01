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

describe('Orders & Inventory API Integration Tests', () => {
    let token;
    let product;

    beforeEach(async () => {
        // Register & login user
        const authRes = await request(app).post('/api/v1/auth/register').send({
            name: 'Order Tester',
            email: 'order@example.com',
            password: 'Password123!',
        });
        token = authRes.body.token;

        // Create sample product with stock = 10
        product = await Product.create({
            title: 'Wireless Earbuds Pro',
            description: 'High quality noise cancelling earbuds',
            price: 150,
            category: 'earphones',
            brand: 'TechBrand',
            stock: 10,
            thumbnail: 'https://example.com/earbuds.jpg',
        });
    });

    const validShippingAddress = {
        fullName: 'Order Tester',
        street: '123 Market Street',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560001',
        phone: '+91 9876543210',
    };

    describe('POST /api/v1/orders', () => {
        it('should successfully create an order and decrement product stock', async () => {
            const res = await request(app)
                .post('/api/v1/orders')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    orderItems: [{ product: product._id.toString(), quantity: 2 }],
                    shippingAddress: validShippingAddress,
                    paymentMethod: 'COD',
                });

            expect(res.status).toBe(201);
            expect(res.body.status).toBe('success');
            expect(res.body.data.order.totalAmount).toBe(300); // 150 * 2
            expect(res.body.data.order.orderItems).toHaveLength(1);

            // Verify stock in DB was decremented from 10 to 8
            const updatedProduct = await Product.findById(product._id);
            expect(updatedProduct.stock).toBe(8);
        });

        it('should reject order when requested quantity exceeds available stock', async () => {
            const res = await request(app)
                .post('/api/v1/orders')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    orderItems: [{ product: product._id.toString(), quantity: 99 }],
                    shippingAddress: validShippingAddress,
                    paymentMethod: 'COD',
                });

            expect(res.status).toBe(400);
            expect(res.body.status).toBe('fail');
            expect(res.body.message).toMatch(/insufficient stock/i);

            // Stock should remain unchanged
            const unchangedProduct = await Product.findById(product._id);
            expect(unchangedProduct.stock).toBe(10);
        });

        it('should reject order creation without authentication', async () => {
            const res = await request(app)
                .post('/api/v1/orders')
                .send({
                    orderItems: [{ product: product._id.toString(), quantity: 1 }],
                    shippingAddress: validShippingAddress,
                });

            expect(res.status).toBe(401);
        });
    });

    describe('GET /api/v1/orders/myorders', () => {
        it('should return user order history', async () => {
            // Place an order first
            await request(app)
                .post('/api/v1/orders')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    orderItems: [{ product: product._id.toString(), quantity: 1 }],
                    shippingAddress: validShippingAddress,
                    paymentMethod: 'COD',
                });

            const res = await request(app)
                .get('/api/v1/orders/myorders')
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body.status).toBe('success');
            expect(res.body.data.orders).toHaveLength(1);
        });
    });
});
