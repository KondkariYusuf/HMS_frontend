/**
 * @file moduleService.js
 * @description Frontend API service for HMS Module entity (/api/module).
 */

const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
  const cleanBase = envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
  const apiBase = cleanBase.endsWith('/api') ? cleanBase : `${cleanBase}/api`;
  return `${apiBase}/module`;
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

export const moduleService = {
  /**
   * Get paginated modules list
   * GET /api/module
   * @param {Object} params - { page, limit, search, isActive, subModuleData }
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
      return { success: false, message: err.message || 'Error fetching modules' };
    }
  },

  /**
   * Get module by ID
   * GET /api/module/:id
   * @param {string} id
   * @param {Object} params - { subModuleData }
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
      return { success: false, message: err.message || 'Error fetching module details' };
    }
  },

  /**
   * Create module
   * POST /api/module
   * @param {Object} data - { name, description, isActive }
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
      return { success: false, message: err.message || 'Error creating module' };
    }
  },

  /**
   * Update module
   * PUT /api/module/:id
   * @param {string} id
   * @param {Object} data - { name, description, isActive }
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
      return { success: false, message: err.message || 'Error updating module' };
    }
  },

  /**
   * Delete module
   * DELETE /api/module/:id
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
      return { success: false, message: err.message || 'Error deleting module' };
    }
  },
};

export default moduleService;
