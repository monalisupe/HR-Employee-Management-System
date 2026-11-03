const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = require('./app');
const { connectDB } = require('./config/db');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // 1. Attempt PostgreSQL connection
  await connectDB();

  // 2. Start HTTP listener
  app.listen(PORT, () => {
    logger.info(`HireFlow / SecureTenant backend running on port ${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
};

startServer();
