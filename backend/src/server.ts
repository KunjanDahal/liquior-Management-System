import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getConnection, closeConnection } from './config/database';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { logger } from './utils/logger';
import authRoutes from './routes/auth.routes';
import posRoutes from './routes/pos.routes';
import inventoryRoutes from './routes/inventory.routes';
import customerRoutes from './routes/customer.routes';
import storeRoutes from './routes/store.routes';
import registerRoutes from './routes/register.routes';
import batchRoutes from './routes/batch.routes';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/pos', posRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/registers', registerRoutes);
app.use('/api/batches', batchRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

/**
 * Start the server
 */
async function startServer(): Promise<void> {
  try {
    // Test database connection (optional - server will start even if DB is unavailable)
    logger.info('Testing database connection...');
    try {
      await getConnection();
      logger.info('✅ Database connected successfully');
    } catch (dbError) {
      logger.warn('⚠️  Database connection failed - using mock data');
      logger.warn('   To use real database, ensure SQL Server is running and .env is configured');
    }
    
    // Start listening
    app.listen(PORT, () => {
      logger.info('');
      logger.info('═══════════════════════════════════════════════════');
      logger.info(`🚀 RMH POS Backend Server Started`);
      logger.info('═══════════════════════════════════════════════════');
      logger.info(`   URL:         http://localhost:${PORT}`);
      logger.info(`   Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`   Database:    ${process.env.DB_NAME || 'rmhsample (mock)'}`);
      logger.info('═══════════════════════════════════════════════════');
      logger.info('');
      logger.info('📝 Available Cashiers (use Number field as username):');
      logger.info('   Number: 100 - Administrator (Security Level: 0)');
      logger.info('   Number: 101 - Eugenia Dean (Security Level: 5)');
      logger.info('   Number: 102 - Tanguy Parry (Security Level: 6)');
      logger.info('   Number: 103 - Tony Brandi (Security Level: 7)');
      logger.info('   Number: 999 - 999 (Security Level: 0)');
      logger.info('   Note: Passwords are NULL in sample DB (any password will work)');
      logger.info('');
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  logger.info('Received SIGINT signal. Closing server...');
  await closeConnection();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('Received SIGTERM signal. Closing server...');
  await closeConnection();
  process.exit(0);
});

// Start the server
startServer();

export default app;
