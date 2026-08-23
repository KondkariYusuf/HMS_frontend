/**
 * @file permissionService.js
 * @description Roles & Permissions backend API integration service (/api/permission, /api/role, /api/role-permission)
 */

const getApiUrl = (endpoint) => {
  const envUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
  const cleanBase = envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
  const apiBase = cleanBase.endsWith('/api') ? cleanBase : `${cleanBase}/api`;
  return `${apiBase}/${endpoint}`;
};

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken') || localStorage.getItem('syncstays_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

export const permissionService = {
  /**
   * Get all permissions
   * GET /api/permission
   */
  getPermissions: async () => {
    try {
      const res = await fetch(getApiUrl('permission'), {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return await res.json();
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  /**
   * Get all roles
   * GET /api/role
   */
  getRoles: async () => {
    try {
      const res = await fetch(getApiUrl('role'), {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return await res.json();
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  /**
   * Get permissions assigned to a role
   * GET /api/role-permission
   */
  getRolePermissions: async (roleId) => {
    try {
      const url = roleId ? `${getApiUrl('role-permission')}?roleId=${roleId}` : getApiUrl('role-permission');
      const res = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return await res.json();
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  /**
   * Bulk assign permissions to a role
   * POST /api/role-permission/bulk-change
   */
  bulkAssignRolePermissions: async (roleId, permissionIds) => {
    try {
      const res = await fetch(`${getApiUrl('role-permission')}/bulk-change`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ roleId, permissionIds }),
      });
      return await res.json();
    } catch (err) {
      return { success: false, message: err.message };
    }
  },
};

export default permissionService;
