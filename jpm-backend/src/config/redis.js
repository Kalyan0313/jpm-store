import Redis from 'ioredis';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

let redisClient = null;
let isConnected = false;

// Initialize Redis only if not in test environment, or if explicitly requested
if (env.NODE_ENV !== 'test') {
    try {
        redisClient = new Redis(env.REDIS_URL, {
            maxRetriesPerRequest: 1,
            retryStrategy(times) {
                if (times > 3) {
                    logger.warn('⚠️ Redis max connection retry attempts reached. Operating in DB-only fallback mode.');
                    return null; // Stop retrying and fallback seamlessly to MongoDB
                }
                return Math.min(times * 100, 2000);
            },
            reconnectOnError(err) {
                logger.warn(`⚠️ Redis reconnect error: ${err.message}`);
                return false;
            },
            lazyConnect: true,
        });

        redisClient.on('connect', () => {
            isConnected = true;
            logger.info('⚡ Redis Connected successfully.');
        });

        redisClient.on('error', (err) => {
            isConnected = false;
            logger.warn(`⚠️ Redis error (${err.message}). Falling back to direct database queries.`);
        });

        redisClient.on('close', () => {
            isConnected = false;
        });

        // Attempt initial connection without blocking server boot
        redisClient.connect().catch((err) => {
            logger.warn(`⚠️ Could not establish initial Redis connection (${err.message}). Falling back to DB.`);
        });
    } catch (err) {
        logger.warn(`⚠️ Redis client initialization failed: ${err.message}`);
    }
}

export const isRedisReady = () => isConnected && redisClient?.status === 'ready';

/**
 * Get cached JSON data by key
 */
export const cacheGet = async (key) => {
    if (!isRedisReady()) return null;
    try {
        const data = await redisClient.get(key);
        if (!data) return null;
        return JSON.parse(data);
    } catch (err) {
        logger.warn(`⚠️ Redis cacheGet error for key "${key}": ${err.message}`);
        return null;
    }
};

/**
 * Set cached JSON data with TTL (default 1800s / 30 mins)
 */
export const cacheSet = async (key, value, ttlSeconds = 1800) => {
    if (!isRedisReady()) return false;
    try {
        const serialized = JSON.stringify(value);
        await redisClient.setex(key, ttlSeconds, serialized);
        return true;
    } catch (err) {
        logger.warn(`⚠️ Redis cacheSet error for key "${key}": ${err.message}`);
        return false;
    }
};

/**
 * Invalidate a specific key or keys matching a wildcard pattern (e.g., 'products:*')
 */
export const cacheDel = async (patternOrKey) => {
    if (!isRedisReady()) return false;
    try {
        if (patternOrKey.includes('*')) {
            const keys = await redisClient.keys(patternOrKey);
            if (keys.length > 0) {
                await redisClient.del(...keys);
                logger.info(`🧹 Invalidated ${keys.length} Redis cache keys matching "${patternOrKey}"`);
            }
        } else {
            await redisClient.del(patternOrKey);
            logger.info(`🧹 Invalidated Redis cache key "${patternOrKey}"`);
        }
        return true;
    } catch (err) {
        logger.warn(`⚠️ Redis cacheDel error for pattern "${patternOrKey}": ${err.message}`);
        return false;
    }
};

export { redisClient };
