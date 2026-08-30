/**
 * @file modulePermissionService.js
 * @description Frontend API service for HMS Module-Permission entity (/api/module-permission).
 */

const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
  const cleanBase = envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
  const apiBase = cleanBase.endsWith('/api') ? cleanBase : `${cleanBase}/api`;
  return `${apiBase}/module-permission`;
};

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken') || localStorage.getItem('syncstays_token');
  const activeBranchId = localStorage.getItem('syncstays_branch_id');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(activeBranchId ? { 'x-branch-id': activeBranchId } : {}),
  };
};

export const modulePermissionService = {
  /**
   * Get module-permission mappings
   * GET /api/module-permission?subModuleId=...&fetchAll=true
   * @param {Object} params - { subModuleId, permissionId, fetchAll, page, limit }
   */
  getAll: async (params = {}) => {
    try {
      const cleanParams = {};
      Object.keys(params).forEach((key) => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          cleanParams[key] = params[key];
        }
      });
      const query = new window.URLSearchParams(cleanParams).toString();
      const baseUrl = getApiBaseUrl();
      const url = query ? `${baseUrl}?${query}` : baseUrl;
      const res = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return await res.json();
    } catch (err) {
      return { success: false, message: err.message || 'Error fetching module permissions' };
    }
  },

  /**
   * Get module-permission by ID
   * GET /api/module-permission/:id
   * @param {string} id
   */
  getById: async (id) => {
    try {
      const res = await fetch(`${getApiBaseUrl()}/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return await res.json();
    } catch (err) {
      return { success: false, message: err.message || 'Error fetching module permission details' };
    }
  },

  /**
   * Bulk assign module permissions (POST)
   * POST /api/module-permission
   * @param {Object} data - { subModuleId, permissionIds }
   */
  create: async (data) => {
    try {
      const res = await fetch(getApiBaseUrl(), {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (err) {
      return { success: false, message: err.message || 'Error assigning module permissions' };
    }
  },

  /**
   * Update module permissions for a subModuleId (PUT)
   * PUT /api/module-permission/:subModuleId
   * @param {string} subModuleId
   * @param {Object} data - { permissionIds }
   */
  update: async (subModuleId, data) => {
    try {
      const res = await fetch(`${getApiBaseUrl()}/${subModuleId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (err) {
      return { success: false, message: err.message || 'Error updating module permissions' };
    }
  },

  /**
   * Delete / Clear all module permissions for a subModuleId or single record ID
   * DELETE /api/module-permission/:id
   * @param {string} id - subModuleId or record UUID
   */
  delete: async (id) => {
    try {
      const res = await fetch(`${getApiBaseUrl()}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return await res.json();
    } catch (err) {
      return { success: false, message: err.message || 'Error clearing module permissions' };
    }
  },
};

export default modulePermissionService;
