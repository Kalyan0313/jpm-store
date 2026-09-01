import request from 'supertest';
import app from '../src/app.js';
import { connectTestDB, closeTestDB, clearTestDB } from './helpers/db.js';

beforeAll(async () => {
    await connectTestDB();
});

afterAll(async () => {
    await closeTestDB();
});

afterEach(async () => {
    await clearTestDB();
});

describe('Authentication API Integration Tests', () => {
    const validUser = {
        name: 'John Tester',
        email: 'john@example.com',
        password: 'Password123!',
    };

    describe('POST /api/v1/auth/register', () => {
        it('should successfully register a new user and return a JWT token', async () => {
            const res = await request(app)
                .post('/api/v1/auth/register')
                .send(validUser);

            expect(res.status).toBe(201);
            expect(res.body.status).toBe('success');
            expect(res.body.token).toBeDefined();
            expect(res.body.data.user.email).toBe(validUser.email.toLowerCase());
            expect(res.body.data.user.password).toBeUndefined();
        });

        it('should fail with 400 when registering with an existing email', async () => {
            await request(app).post('/api/v1/auth/register').send(validUser);
            const res = await request(app).post('/api/v1/auth/register').send(validUser);

            expect(res.status).toBe(400);
            expect(res.body.status).toBe('fail');
            expect(res.body.message).toMatch(/already registered/i);
        });

        it('should fail validation when password is too short', async () => {
            const res = await request(app)
                .post('/api/v1/auth/register')
                .send({
                    name: 'Bad Pass',
                    email: 'badpass@example.com',
                    password: '123',
                });

            expect(res.status).toBe(400);
            expect(res.body.status).toBe('fail');
        });
    });

    describe('POST /api/v1/auth/login', () => {
        beforeEach(async () => {
            await request(app).post('/api/v1/auth/register').send(validUser);
        });

        it('should successfully log in with valid credentials', async () => {
            const res = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: validUser.email,
                    password: validUser.password,
                });

            expect(res.status).toBe(200);
            expect(res.body.status).toBe('success');
            expect(res.body.token).toBeDefined();
            expect(res.body.data.user.email).toBe(validUser.email.toLowerCase());
        });

        it('should reject login with incorrect password', async () => {
            const res = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: validUser.email,
                    password: 'WrongPassword999!',
                });

            expect(res.status).toBe(401);
            expect(res.body.status).toBe('fail');
            expect(res.body.message).toMatch(/(incorrect|invalid) email or password/i);
        });

        it('should reject login with non-existent email', async () => {
            const res = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: 'nonexistent@example.com',
                    password: 'Password123!',
                });

            expect(res.status).toBe(401);
            expect(res.body.status).toBe('fail');
        });
    });

    describe('Protected Route Access: GET /api/v1/auth/me', () => {
        it('should return user profile when valid Bearer token is provided', async () => {
            const regRes = await request(app).post('/api/v1/auth/register').send(validUser);
            const token = regRes.body.token;

            const res = await request(app)
                .get('/api/v1/auth/me')
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body.status).toBe('success');
            expect(res.body.data.user.email).toBe(validUser.email.toLowerCase());
        });

        it('should return 401 Unauthorized when no token is provided', async () => {
            const res = await request(app).get('/api/v1/auth/me');

            expect(res.status).toBe(401);
            expect(res.body.status).toBe('fail');
            expect(res.body.message).toMatch(/logged in/i);
        });

        it('should return 401 Unauthorized when invalid token is provided', async () => {
            const res = await request(app)
                .get('/api/v1/auth/me')
                .set('Authorization', 'Bearer invalid_fake_token_123');

            expect(res.status).toBe(401);
            expect(res.body.status).toBe('fail');
        });
    });
});
