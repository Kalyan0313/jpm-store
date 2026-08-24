import { AppError } from '../utils/appError.js';

/**
 * Middleware wrapper for Zod validation schemas
 * @param {import('zod').ZodSchema} schema
 * @param {'body' | 'query' | 'params'} source
 */
export const validate = (schema, source = 'body') => {
    return (req, res, next) => {
        const result = schema.safeParse(req[source]);
        if (!result.success) {
            const formattedErrors = result.error.errors.map(
                (e) => `${e.path.join('.')}: ${e.message}`
            ).join('; ');
            return next(new AppError(`Validation failed: ${formattedErrors}`, 400));
        }
        // Replace request data with parsed/sanitized data
        req[source] = result.data;
        next();
    };
};
