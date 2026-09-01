import request from 'supertest';
import app from '../src/app.js';
import { connectTestDB, closeTestDB, clearTestDB } from './helpers/db.js';
import { Product } from '../src/models/Product.js';
import { User } from '../src/models/User.js';

beforeAll(async () => {
    await connectTestDB();
});

afterAll(async () => {
    await closeTestDB();
});

afterEach(async () => {
    await clearTestDB();
});

describe('Products API Integration Tests', () => {
    const sampleProducts = [
        {
            title: 'Apple MacBook Pro M3',
            description: 'Powerful Apple laptop with M3 chip',
            price: 1999,
            category: 'laptops',
            brand: 'Apple',
            stock: 25,
            thumbnail: 'https://example.com/macbook.jpg',
            rating: 4.9,
        },
        {
            title: 'Dell XPS 15',
            description: 'Premium Windows laptop with OLED screen',
            price: 1499,
            category: 'laptops',
            brand: 'Dell',
            stock: 15,
            thumbnail: 'https://example.com/dell.jpg',
            rating: 4.7,
        },
        {
            title: 'Sony WH-1000XM5 Headphones',
            description: 'Industry leading noise canceling earphones',
            price: 399,
            category: 'earphones',
            brand: 'Sony',
            stock: 40,
            thumbnail: 'https://example.com/sony.jpg',
            rating: 4.8,
        },
    ];

    let adminToken;
    let userToken;

    beforeEach(async () => {
        await Product.create(sampleProducts);

        // Create Admin user
        const adminRes = await request(app).post('/api/v1/auth/register').send({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'AdminPassword123!',
        });
        await User.findOneAndUpdate({ email: 'admin@example.com' }, { role: 'admin' });
        // Re-login to get updated JWT token with admin role
        const adminLogin = await request(app).post('/api/v1/auth/login').send({
            email: 'admin@example.com',
            password: 'AdminPassword123!',
        });
        adminToken = adminLogin.body.token;

        // Create regular user
        const userRes = await request(app).post('/api/v1/auth/register').send({
            name: 'Regular User',
            email: 'user@example.com',
            password: 'UserPassword123!',
        });
        userToken = userRes.body.token;
    });

    describe('GET /api/v1/products', () => {
        it('should retrieve list of all products with pagination metadata', async () => {
            const res = await request(app).get('/api/v1/products');

            expect(res.status).toBe(200);
            expect(res.body.status).toBe('success');
            expect(res.body.results).toBe(3);
            expect(res.body.total).toBe(3);
            expect(res.body.data.products).toHaveLength(3);
        });

        it('should filter products by category', async () => {
            const res = await request(app).get('/api/v1/products?category=laptops');

            expect(res.status).toBe(200);
            expect(res.body.results).toBe(2);
            expect(res.body.data.products.every((p) => p.category === 'laptops')).toBe(true);
        });

        it('should filter products by price range', async () => {
            const res = await request(app).get('/api/v1/products?minPrice=1000&maxPrice=1600');

            expect(res.status).toBe(200);
            expect(res.body.results).toBe(1);
            expect(res.body.data.products[0].title).toBe('Dell XPS 15');
        });

        it('should sort products by price ascending', async () => {
            const res = await request(app).get('/api/v1/products?sort=price-asc');

            expect(res.status).toBe(200);
            expect(res.body.data.products[0].price).toBe(399);
            expect(res.body.data.products[2].price).toBe(1999);
        });
    });

    describe('GET /api/v1/products/:id', () => {
        it('should return product details for valid ID', async () => {
            const product = await Product.findOne({ title: 'Apple MacBook Pro M3' });
            const res = await request(app).get(`/api/v1/products/${product._id}`);

            expect(res.status).toBe(200);
            expect(res.body.status).toBe('success');
            expect(res.body.data.product.title).toBe('Apple MacBook Pro M3');
        });

        it('should return 404 for non-existent product ID', async () => {
            const fakeId = '507f1f77bcf86cd799439011';
            const res = await request(app).get(`/api/v1/products/${fakeId}`);

            expect(res.status).toBe(404);
            expect(res.body.status).toBe('fail');
        });
    });

    describe('POST /api/v1/products (RBAC Authorization)', () => {
        const newProduct = {
            title: 'Apple Watch Series 9',
            description: 'Smart health watch',
            price: 499,
            category: 'smartwatches',
            brand: 'Apple',
            stock: 30,
            thumbnail: 'https://example.com/watch.jpg',
        };

        it('should allow admin to create a new product', async () => {
            const res = await request(app)
                .post('/api/v1/products')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(newProduct);

            expect(res.status).toBe(201);
            expect(res.body.status).toBe('success');
            expect(res.body.data.product.title).toBe(newProduct.title);
        });

        it('should forbid regular users from creating a product (403 Forbidden)', async () => {
            const res = await request(app)
                .post('/api/v1/products')
                .set('Authorization', `Bearer ${userToken}`)
                .send(newProduct);

            expect(res.status).toBe(403);
            expect(res.body.status).toBe('fail');
        });

        it('should reject unauthenticated requests (401 Unauthorized)', async () => {
            const res = await request(app)
                .post('/api/v1/products')
                .send(newProduct);

            expect(res.status).toBe(401);
        });
    });
});
