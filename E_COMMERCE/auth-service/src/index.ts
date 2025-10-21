import dotenv from 'dotenv';
import app from './app';
import { connectDatabase, logger, disconnectDatabase } from './config/database';
import { rabbitMQClient } from '../../../shared/utils/rabbitmq';
import { authService } from './services/authService';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3001;

/**
 * Initialize the service
 */
async function initializeService(): Promise<void> {
  try {
    logger.info('🚀 Starting Auth Service...');

    // Connect to MongoDB
    await connectDatabase();
    logger.info('✅ Database connected successfully');

    // Connect to RabbitMQ
    await rabbitMQClient.connect();
    logger.info('✅ RabbitMQ connected successfully');

    // Create necessary queues and exchanges
    await setupRabbitMQ();

    // Start the server
    const server = app.listen(PORT, () => {
      logger.info(`✅ Auth Service running on port ${PORT}`);
      logger.info(`🌐 Health check: http://localhost:${PORT}/health`);
      logger.info(`🔐 API endpoints: http://localhost:${PORT}/auth`);
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      logger.info(`Received ${signal}, starting graceful shutdown...`);
      
      // Close server
      server.close(() => {
        logger.info('HTTP server closed');
      });

      // Cleanup services
      try {
        await authService.cleanup();
        await rabbitMQClient.close();
        await disconnectDatabase();
        logger.info('✅ Graceful shutdown completed');
        process.exit(0);
      } catch (error) {
        logger.error('Error during shutdown:', error);
        process.exit(1);
      }
    };

    // Handle shutdown signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error);
      gracefulShutdown('uncaughtException');
    });

    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
      gracefulShutdown('unhandledRejection');
    });

  } catch (error) {
    logger.error('Failed to initialize service:', error);
    process.exit(1);
  }
}

/**
 * Setup RabbitMQ queues and exchanges
 */
async function setupRabbitMQ(): Promise<void> {
  try {
    // Create user events exchange
    await rabbitMQClient.publishToExchange(
      'user.events',
      'setup',
      {
        type: 'exchange.setup',
        data: { exchange: 'user.events' },
        timestamp: new Date(),
        correlationId: 'setup'
      }
    );

    // Create queues for other services to consume
    await rabbitMQClient.createQueue('user.created');
    await rabbitMQClient.createQueue('user.updated');
    await rabbitMQClient.createQueue('user.login');
    await rabbitMQClient.createQueue('user.logout');
    await rabbitMQClient.createQueue('user.password_changed');
    await rabbitMQClient.createQueue('user.password_reset');

    logger.info('✅ RabbitMQ setup completed');
  } catch (error) {
    logger.error('Failed to setup RabbitMQ:', error);
    // Don't throw error as this is not critical for the service to start
  }
}

/**
 * Start the service
 */
initializeService().catch((error) => {
  logger.error('Service initialization failed:', error);
  process.exit(1);
});
