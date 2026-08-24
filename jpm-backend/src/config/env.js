import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.string().transform((val) => parseInt(val, 10)).default('5000'),
    MONGODB_URI: z.string().min(1, 'MONGODB_URI is required').default('mongodb://localhost:27017/jpm_store'),
    JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters').default('jpm_store_super_secret_jwt_key_2026_production_grade_security!'),
    JWT_EXPIRES_IN: z.string().default('7d'),
    JWT_COOKIE_EXPIRES_IN: z.string().transform((val) => parseInt(val, 10)).default('7'),
    CORS_ORIGIN: z.string().default('http://localhost:3000'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
    console.error('❌ Invalid environment variables:', parsedEnv.error.format());
    process.exit(1);
}

export const env = parsedEnv.data;
