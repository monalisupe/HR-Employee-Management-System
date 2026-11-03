/**
 * PostgreSQL Database Connection (node-postgres Pool)
 * Connects directly to PostgreSQL (Supabase Postgres, AWS RDS, Neon, or local Postgres)
 */
const { Pool } = require('pg');
const logger = require('../utils/logger');

let pool = null;

const createPool = () => {
  if (pool) return pool;

  // 1. Connection string priority
  const connectionString =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.SUPABASE_DB_URL;

  // 2. SSL Configuration (required for Supabase, Neon, AWS, Cloud Postgres)
  const isLocalhost =
    connectionString?.includes('localhost') ||
    connectionString?.includes('127.0.0.1') ||
    process.env.PGHOST === 'localhost';

  const sslConfig =
    process.env.DB_SSL === 'false' || isLocalhost
      ? false
      : { rejectUnauthorized: false };

  // 3. Initialize pg Pool
  if (connectionString) {
    pool = new Pool({
      connectionString,
      ssl: sslConfig,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });
  } else {
    // Individual PG environment variables
    pool = new Pool({
      host: process.env.PGHOST || 'localhost',
      port: parseInt(process.env.PGPORT, 10) || 5432,
      user: process.env.PGUSER || 'postgres',
      password: process.env.PGPASSWORD || '',
      database: process.env.PGDATABASE || 'postgres',
      ssl: sslConfig,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });
  }

  pool.on('error', (err) => {
    logger.error('Unexpected error on idle PostgreSQL client', { error: err.message });
  });

  return pool;
};

/**
 * Connect and test PostgreSQL database connection
 */
const connectDB = async () => {
  try {
    const currentPool = createPool();

    // Test connection with a fast diagnostic query
    const client = await currentPool.connect();
    const res = await client.query('SELECT current_database(), current_user, version()');
    client.release();

    const dbName = res.rows[0]?.current_database || 'postgres';
    const dbUser = res.rows[0]?.current_user || 'postgres';
    logger.info(`PostgreSQL Connected Successfully: database="${dbName}", user="${dbUser}"`);
    return currentPool;
  } catch (error) {
    logger.error(`PostgreSQL Connection Failed: ${error.message}`);
    logger.warn(
      'To connect to your PostgreSQL database, ensure your backend/.env contains a valid DATABASE_URL:\n' +
      '  DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/postgres?sslmode=require\n' +
      'For Supabase, copy the "URI" connection string from Supabase Project Settings -> Database.'
    );
    return null;
  }
};

/**
 * Execute parameterized SQL query
 */
const query = async (text, params) => {
  const currentPool = createPool();
  const start = Date.now();
  try {
    const res = await currentPool.query(text, params);
    const duration = Date.now() - start;
    logger.debug('Executed PostgreSQL query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    logger.error('PostgreSQL query error', { text, error: error.message });
    throw error;
  }
};

module.exports = {
  connectDB,
  query,
  getPool: createPool,
};
