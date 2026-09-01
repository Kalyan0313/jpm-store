import rateLimit from 'express-rate-limit';

export const apiLimiter = process.env.NODE_ENV === 'test'
    ? (req, res, next) => next()
    : rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 200, // Limit each IP to 200 requests per window
        standardHeaders: true,
        legacyHeaders: false,
        message: {
            status: 'fail',
            message: 'Too many requests from this IP, please try again after 15 minutes.',
        },
    });

export const authLimiter = process.env.NODE_ENV === 'test'
    ? (req, res, next) => next()
    : rateLimit({
        windowMs: 60 * 60 * 1000, // 1 hour
        max: 20, // 20 login/register attempts per hour per IP
        standardHeaders: true,
        legacyHeaders: false,
        message: {
            status: 'fail',
            message: 'Too many authentication attempts from this IP, please try again after an hour.',
        },
    });
