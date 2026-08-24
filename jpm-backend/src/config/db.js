import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

let mongoMemoryServer = null;

export const connectDB = async () => {
    // Attach error listener first to avoid unhandled error event warnings
    mongoose.connection.removeAllListeners('error');
    mongoose.connection.on('error', (err) => {
        logger.error(`❌ MongoDB connection event error: ${err.message}`);
    });

    try {
        logger.info(`Attempting MongoDB connection to ${env.MONGODB_URI}...`);
        const conn = await mongoose.connect(env.MONGODB_URI, {
            autoIndex: true,
            serverSelectionTimeoutMS: 2000,
        });
        logger.info(`🍃 MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    } catch (error) {
        logger.warn(`⚠️ Primary MongoDB connection failed (${error.message}). Initializing In-Memory MongoDB...`);
        try {
            const { MongoMemoryServer } = await import('mongodb-memory-server');
            mongoMemoryServer = await MongoMemoryServer.create();
            const memoryUri = mongoMemoryServer.getUri();

            await mongoose.disconnect();
            const conn = await mongoose.connect(memoryUri);
            logger.info(`🍃 In-Memory MongoDB Connected: ${memoryUri}`);

            const { seedInitialData } = await import('../seed/seeder.js');
            await seedInitialData();
        } catch (memErr) {
            logger.error(`❌ Fallback DB Error: ${memErr.message}`);
        }
    }
};
