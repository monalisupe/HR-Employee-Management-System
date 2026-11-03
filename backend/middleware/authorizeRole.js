/**
 * Role-Based Access Control (RBAC) Middleware
 * Restricts route access to specified roles: 'hr', 'candidate', 'employee'.
 */
const { forbidden, unauthorized } = require('../utils/apiResponse');

const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return unauthorized(res, 'Authentication required before role authorization');
    }

    const userRole = req.user.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      return forbidden(
        res,
        `Access denied. Role '${userRole || 'unspecified'}' is not authorized for this resource.`
      );
    }

    next();
  };
};

module.exports = authorizeRole;
