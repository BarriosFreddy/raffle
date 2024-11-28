import dotenv from 'dotenv';
import { Validators } from './src/utils/validators.js';
import { connectDatabase } from './src/config/database.js';
import { createApp } from './src/config/app.js';
import { logger } from './src/utils/logger.js';

// Load environment variables
dotenv.config();

// Validate required environment variables
Validators.validateEnvVariables([
  'MP_ACCESS_TOKEN',
  'FRONTEND_URL',
  'MONGODB_URI',
  'NODE_ENV'
]);

// Create Express app
const app = createApp();

// Start server
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await connectDatabase();
    
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();