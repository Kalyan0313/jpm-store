import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import morgan from 'morgan';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';
import { AppError } from './utils/appError.js';
import { globalErrorHandler } from './middlewares/errorHandler.js';
import { apiLimiter } from './middlewares/rateLimiter.js';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

const app = express();

// 1) Global Security Middlewares
app.use(helmet());

app.use(
    cors({
        origin: env.CORS_ORIGIN,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);

// Rate limiting
app.use('/api', apiLimiter);

// Logging HTTP requests
if (env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Body parsers & Cookie parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// 2) Health Check Endpoint
app.get('/api/v1/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'JPM Store Node.js/Express API server is running healthy',
        timestamp: new Date().toISOString(),
        environment: env.NODE_ENV,
    });
});

// 3) API Routes Mount
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/orders', orderRoutes);

// 4) 404 Route Handler for undefined endpoints
app.all('*', (req, res, next) => {
    next(new AppError(`Cannot find endpoint ${req.originalUrl} on this server`, 404));
});

// 5) Global Centralized Error Handling Middleware
app.use(globalErrorHandler);

export default app;
