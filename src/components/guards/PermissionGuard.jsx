/**
 * @file PermissionGuard.jsx
 * @description Page-level route guard for SyncStays HMS.
 * Ensures an authenticated Hotel user possesses the required permission code
 * in user.permissions[] before rendering the protected page component.
 */

import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@app/AuthContext';
import AccessDenied from './AccessDenied';

/**
 * Checks if the user's permissions array contains the required permission code.
 * Supports permissions stored as strings ("ROOM_READALL") or objects ({ code: "ROOM_READALL" }).
 */
export function hasPermission(user, requiredCode) {
  if (!user || !Array.isArray(user.permissions)) {
    return false;
  }

  return user.permissions.some((permission) => {
    if (typeof permission === 'string') {
      return permission === requiredCode;
    }

    return permission?.code === requiredCode;
  });
}

export default function PermissionGuard({ code, children }) {
  const { user } = useAuth();

  // Fallback to localStorage if AuthContext user state hasn't initialized
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

  // Require valid non-empty permission code AND user permission -> Fail-closed
  if (code && hasPermission(activeUser, code)) {
    return children ? children : <Outlet />;
  }

  // User lacks permission or code is missing -> Render Access Denied UI
  return <AccessDenied code={code} />;
}
