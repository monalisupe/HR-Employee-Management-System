const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/errorHandler');
const { getPool } = require('./config/db');
const logger = require('./utils/logger');

const app = express();

// 1. CORS Configuration (Supports both Vite dev ports 5174 and 5173)
const allowedOrigins = [
  'http://localhost:5174',
  'http://localhost:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:5173',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in dev mode
    },
    credentials: true,
  })
);

// 2. Body Parsing & Cookie Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// 3. Request Logging in Development
app.use((req, res, next) => {
  logger.debug(`${req.method} ${req.url}`);
  next();
});

// 4. Root Home Route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'HireFlow / SecureTenant Enterprise API is running successfully',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// 5. Unified System & Database Health Check
app.get('/api/health', async (req, res) => {
  let dbStatus = 'DISCONNECTED';
  let dbError = null;

  try {
    const pool = getPool();
    if (pool) {
      const client = await pool.connect();
      await client.query('SELECT 1');
      client.release();
      dbStatus = 'CONNECTED';
    }
  } catch (err) {
    dbError = err.message;
  }

  const isHealthy = dbStatus === 'CONNECTED';

  return res.status(200).json({
    success: true,
    status: isHealthy ? 'HEALTHY' : 'DEGRADED',
    timestamp: new Date().toISOString(),
    services: {
      api: 'UP',
      database: {
        type: 'PostgreSQL',
        status: dbStatus,
        ...(dbError && { error: dbError }),
      },
      supabase: {
        configured: Boolean(process.env.SUPABASE_URL),
        url: process.env.SUPABASE_URL || 'Not configured',
      },
    },
  });
});

// 6. Mount Application Routes
app.use('/api/auth', require('./routes/authRoutes'));

// Try loading additional modular route aggregates if present
try {
  app.use('/api/v1', require('./routes'));
} catch (e) {
  logger.warn('Modular routes index not yet mounted:', e.message);
}

// 7. 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.method} ${req.originalUrl}' not found`,
  });
});

// 8. Centralized Global Error Handler
app.use(errorHandler);

module.exports = app;
