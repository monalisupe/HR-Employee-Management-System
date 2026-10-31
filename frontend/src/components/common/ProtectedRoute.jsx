import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

/**
 * ProtectedRoute guards routes from unauthenticated direct URL access.
 * If user is not authenticated, redirects to /login while preserving destination path.
 * If user does not have required role, redirects to their authorized dashboard.
 */
export default function ProtectedRoute({ allowedRole, children }) {
  const { isAuthenticated, activeRole } = useApp();
  const location = useLocation();

  if (!isAuthenticated) {
    // Preserve requested location for post-login redirect
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role-based boundary: if this route requires a specific role and current role does not match
  if (allowedRole && activeRole !== allowedRole) {
    return <Navigate to={`/${activeRole}/dashboard`} replace />;
  }

  return children ? children : <Outlet />;
}

