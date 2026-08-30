/**
 * @file subModuleService.js
 * @description Frontend API service for HMS Sub-Module entity (/api/sub-module).
 */

const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
  const cleanBase = envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
  const apiBase = cleanBase.endsWith('/api') ? cleanBase : `${cleanBase}/api`;
  return `${apiBase}/sub-module`;
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

export const subModuleService = {
  /**
   * Get paginated sub-modules list
   * GET /api/sub-module
   * @param {Object} params - { page, limit, search, moduleId, isActive, moduleData }
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
      return { success: false, message: err.message || 'Error fetching sub-modules' };
    }
  },

  /**
   * Get sub-module by ID
   * GET /api/sub-module/:id
   * @param {string} id
   * @param {Object} params - { moduleData }
   */
  getById: async (id, params = {}) => {
    try {
      const query = new window.URLSearchParams(params).toString();
      const baseUrl = `${getApiBaseUrl()}/${id}`;
      const url = query ? `${baseUrl}?${query}` : baseUrl;
      const res = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return await res.json();
    } catch (err) {
      return { success: false, message: err.message || 'Error fetching sub-module details' };
    }
  },

  /**
   * Create sub-module
   * POST /api/sub-module
   * @param {Object} data - { moduleId, name, description, isActive }
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
      return { success: false, message: err.message || 'Error creating sub-module' };
    }
  },

  /**
   * Update sub-module
   * PUT /api/sub-module/:id
   * @param {string} id
   * @param {Object} data - { moduleId, name, description, isActive }
   */
  update: async (id, data) => {
    try {
      const res = await fetch(`${getApiBaseUrl()}/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (err) {
      return { success: false, message: err.message || 'Error updating sub-module' };
    }
  },

  /**
   * Delete sub-module
   * DELETE /api/sub-module/:id
   * @param {string} id
   */
  delete: async (id) => {
    try {
      const res = await fetch(`${getApiBaseUrl()}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return await res.json();
    } catch (err) {
      return { success: false, message: err.message || 'Error deleting sub-module' };
    }
  },
};

export default subModuleService;
