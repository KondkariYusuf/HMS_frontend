/**
 * @file permissionService.js
 * @description Roles & Permissions backend API integration service (/api/permission, /api/role, /api/role-permission)
 */

const getApiUrl = (endpoint) => {
  const envUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  const cleanBase = envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
  const apiBase = cleanBase.endsWith('/api') ? cleanBase : `${cleanBase}/api`;
  return `${apiBase}/${endpoint}`;
};

const getAuthHeaders = () => {
  const token = localStorage.getItem('syncstays_token') || localStorage.getItem('authToken');
  const activeBranchId = localStorage.getItem('syncstays_branch_id');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(activeBranchId ? { 'x-branch-id': activeBranchId } : {}),
  };
};

const buildQuery = (params = {}) => {
  const cleanParams = {};
  if (params && typeof params === 'object') {
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        cleanParams[key] = params[key];
      }
    });
  }
  const query = new window.URLSearchParams(cleanParams).toString();
  return query ? `?${query}` : '';
};

export const permissionService = {
  // ==========================================
  // ROLES (/api/role)
  // ==========================================

  /**
   * Get all roles
   * GET /api/role
   * @param {Object} [params={}] - Optional query params e.g. { fetchAll: 'true' }
   */
  getRoles: async (params = {}) => {
    try {
      const url = `${getApiUrl('role')}${buildQuery(params)}`;
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
   * Get role by ID
   * GET /api/role/:id
   * @param {string} id
   */
  getRoleById: async (id) => {
    try {
      const res = await fetch(`${getApiUrl('role')}/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return await res.json();
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  /**
   * Create custom role
   * POST /api/role
   * @param {Object} data - { name, description, organizationId }
   */
  createRole: async (data) => {
    try {
      const res = await fetch(getApiUrl('role'), {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  /**
   * Update role
   * PUT /api/role/:id
   * @param {string} id
   * @param {Object} data - { name, description }
   */
  updateRole: async (id, data) => {
    try {
      const res = await fetch(`${getApiUrl('role')}/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  /**
   * Delete role
   * DELETE /api/role/:id
   * @param {string} id
   */
  deleteRole: async (id) => {
    try {
      const res = await fetch(`${getApiUrl('role')}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return await res.json();
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  // ==========================================
  // PERMISSIONS (/api/permission)
  // ==========================================

  /**
   * Get all permissions
   * GET /api/permission
   * @param {Object} [params={}] - Optional query params e.g. { fetchAll: 'true' }
   */
  getPermissions: async (params = {}) => {
    try {
      const url = `${getApiUrl('permission')}${buildQuery(params)}`;
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
   * Get permission by ID
   * GET /api/permission/:id
   * @param {string} id
   */
  getPermissionById: async (id) => {
    try {
      const res = await fetch(`${getApiUrl('permission')}/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return await res.json();
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  /**
   * Create permission
   * POST /api/permission
   * @param {Object} data - { code, method, baseUrl, path, actionName, description }
   */
  createPermission: async (data) => {
    try {
      const res = await fetch(getApiUrl('permission'), {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  /**
   * Update permission
   * PUT /api/permission/:id
   * @param {string} id
   * @param {Object} data
   */
  updatePermission: async (id, data) => {
    try {
      const res = await fetch(`${getApiUrl('permission')}/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  /**
   * Delete permission
   * DELETE /api/permission/:id
   * @param {string} id
   */
  deletePermission: async (id) => {
    try {
      const res = await fetch(`${getApiUrl('permission')}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return await res.json();
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  // ==========================================
  // ROLE-PERMISSIONS (/api/role-permission)
  // ==========================================

  /**
   * Get permissions assigned to a role or list role-permissions
   * GET /api/role-permission
   * @param {string|Object} [roleIdOrParams]
   */
  getRolePermissions: async (roleIdOrParams) => {
    try {
      let query = '';
      if (typeof roleIdOrParams === 'string') {
        query = `?roleId=${encodeURIComponent(roleIdOrParams)}&fetchAll=true`;
      } else if (roleIdOrParams && typeof roleIdOrParams === 'object') {
        query = buildQuery({ fetchAll: 'true', ...roleIdOrParams });
      }
      const url = `${getApiUrl('role-permission')}${query}`;
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
   * Get single role-permission mapping by ID
   * GET /api/role-permission/:id
   * @param {string} id
   */
  getRolePermissionById: async (id) => {
    try {
      const res = await fetch(`${getApiUrl('role-permission')}/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return await res.json();
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  /**
   * Create role-permission mapping
   * POST /api/role-permission
   * @param {Object} data - { roleId, modulePermissionId }
   */
  createRolePermission: async (data) => {
    try {
      const res = await fetch(getApiUrl('role-permission'), {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  /**
   * Update role-permission mapping
   * PUT /api/role-permission/:id
   * @param {string} id
   * @param {Object} data
   */
  updateRolePermission: async (id, data) => {
    try {
      const res = await fetch(`${getApiUrl('role-permission')}/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  /**
   * Delete role-permission mapping
   * DELETE /api/role-permission/:id
   * @param {string} id
   */
  deleteRolePermission: async (id) => {
    try {
      const res = await fetch(`${getApiUrl('role-permission')}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return await res.json();
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  /**
   * Bulk assign permissions to a role
   * POST /api/role-permission or DELETE /api/role-permission/:roleId
   * @param {string} roleId
   * @param {Array<string>} modulePermissionIds
   */
  bulkAssignRolePermissions: async (roleId, modulePermissionIds) => {
    try {
      if (!modulePermissionIds || modulePermissionIds.length === 0) {
        const res = await fetch(`${getApiUrl('role-permission')}/${roleId}`, {
          method: 'DELETE',
          headers: getAuthHeaders(),
        });
        return await res.json();
      }

      const res = await fetch(getApiUrl('role-permission'), {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          roleId,
          modulePermissionIds,
        }),
      });
      return await res.json();
    } catch (err) {
      return { success: false, message: err.message };
    }
  },
};

export default permissionService;
