/**
 * Authentication Middleware
 * Validates Bearer token via Supabase Auth or JWT, attaching user to req.user.
 */
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');
const { unauthorized, error: serverError } = require('../utils/apiResponse');
const logger = require('../utils/logger');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return unauthorized(res, 'Authentication token is required (Bearer token)');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return unauthorized(res, 'Invalid authentication token');
    }

    // 1. First attempt verification via Supabase Auth
    if (process.env.SUPABASE_URL && process.env.SUPABASE_PUBLISHABLE_KEY) {
      const { data, error } = await supabase.auth.getUser(token);
      if (!error && data?.user) {
        req.user = {
          id: data.user.id,
          email: data.user.email,
          role: data.user.user_metadata?.role || 'candidate',
          tenantId: data.user.user_metadata?.tenant_id || 'TENANT-ST-2026-X',
          ...data.user.user_metadata,
        };
        return next();
      }
    }

    // 2. Fallback: JWT verification (standard backend token)
    const jwtSecret = process.env.JWT_SECRET || 'hireflow-enterprise-secret-key-2026';
    try {
      const decoded = jwt.verify(token, jwtSecret);
      req.user = decoded;
      return next();
    } catch (jwtErr) {
      // 3. Development / Mock Token Support (for seamless frontend testing)
      if (token.startsWith('mock-') || token === 'demo-token') {
        req.user = {
          id: 'usr-demo-001',
          email: 'demo@hireflow.internal',
          role: req.headers['x-role'] || 'hr',
          tenantId: req.headers['x-tenant-id'] || 'TENANT-ST-2026-X',
        };
        return next();
      }

      return unauthorized(res, 'Invalid or expired authentication token');
    }
  } catch (err) {
    logger.error('Authentication Middleware Error', { error: err.message });
    return serverError(res, 'Internal authentication error');
  }
};

module.exports = authenticate;
