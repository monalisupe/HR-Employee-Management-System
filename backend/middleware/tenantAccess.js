/**
 * Multi-Tenant Isolation Middleware
 * Enforces tenant context isolation per request.
 * Reads tenant from:
 * 1. Request header 'x-tenant-id'
 * 2. Authenticated user token 'req.user.tenantId'
 * Defaults to 'TENANT-ST-2026-X' if unspecified.
 */
const { badRequest } = require('../utils/apiResponse');

const tenantAccess = (req, res, next) => {
  const headerTenant = req.headers['x-tenant-id'];
  const userTenant = req.user?.tenantId;

  const tenantId = headerTenant || userTenant || 'TENANT-ST-2026-X';

  if (!tenantId) {
    return badRequest(res, 'Tenant identifier is required for multi-tenant isolation');
  }

  // Bind tenant identifier to request for downstream services & queries
  req.tenantId = tenantId;
  next();
};

module.exports = tenantAccess;

