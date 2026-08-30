/**
 * @file HotelGuard.jsx
 * @description Route guard protecting /hotel/* routes for SyncStays HMS.
 * Ensures only authenticated non-super-admin users belonging to a valid organization
 * can access Hotel Module routes.
 */

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@app/AuthContext';

export default function HotelGuard({ children }) {
  const { user, token } = useAuth();

  // Fallback to localStorage if AuthContext hasn't fully loaded or initialized
  const activeToken =
    token ||
    localStorage.getItem('syncstays_token') ||
    localStorage.getItem('authToken');

  let activeUser = user;
  if (!activeUser) {
    try {
      const storedUser = localStorage.getItem('syncstays_user');
      if (storedUser) {
        activeUser = JSON.parse(storedUser);
      }
    } catch {
      activeUser = null;
    }
  }

  // 1. NO VALID TOKEN -> Redirect to /login
  if (
    !activeToken ||
    activeToken === 'demo_token' ||
    activeToken === 'null' ||
    activeToken === ''
  ) {
    return <Navigate to="/login" replace />;
  }

  // 2. TOKEN EXISTS BUT USER DATA IS MISSING OR INVALID -> Redirect to /login
  if (!activeUser || typeof activeUser !== 'object') {
    return <Navigate to="/login" replace />;
  }

  // 3. user.role === 'super-admin' MUST NOT enter /hotel/*
  // Redirect away to existing Admin section (/admin/users)
  if (activeUser.role === 'super-admin') {
    return <Navigate to="/admin/users" replace />;
  }

  // 4. Non-super-admin user WITHOUT organizationId -> Deny access
  if (!activeUser.organizationId) {
    return <Navigate to="/login" replace />;
  }

  // 5. Valid Hotel/Organization User -> Grant Access
  return children ? children : <Outlet />;
}
