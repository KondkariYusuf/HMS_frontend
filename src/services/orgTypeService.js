/**
 * @file orgTypeService.js
 * @description Frontend API integration service for Organization Type module.
 * Scanned & matched with Node.js/Express backend (`/api/organization-type`).
 */

const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  const cleanBase = envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
  const apiBase = cleanBase.endsWith('/api') ? cleanBase : `${cleanBase}/api`;
  return `${apiBase}/organization-type`;
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

export const orgTypeService = {
  /**
   * Get all organization types
   * GET /api/organization-type?page=1&limit=10&search=
   */
  getAll: async (params = {}) => {
    const query = new window.URLSearchParams(params).toString();
    const baseUrl = getApiBaseUrl();
    const url = query ? `${baseUrl}?${query}` : baseUrl;
    const res = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  /**
   * Get organization type by ID
   * GET /api/organization-type/:id
   * @param {string|number} id
   */
  getById: async (id) => {
    const res = await fetch(`${getApiBaseUrl()}/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  /**
   * Create a new organization type
   * POST /api/organization-type
   * @param {Object} data { type, typeName, description }
   */
  create: async (data) => {
    const payload = {
      type: (data.type || data.typeName || data.name || '').trim(),
    };
    const res = await fetch(getApiBaseUrl(), {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  /**
   * Update organization type by ID
   * PUT /api/organization-type/:id
   * @param {string|number} id
   * @param {Object} data { type, typeName, description }
   */
  update: async (id, data) => {
    const payload = {
      type: (data.type || data.typeName || data.name || '').trim(),
    };
    const res = await fetch(`${getApiBaseUrl()}/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  /**
   * Delete organization type by ID
   * DELETE /api/organization-type/:id
   * @param {string|number} id
   */
  delete: async (id) => {
    const res = await fetch(`${getApiBaseUrl()}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return res.json();
  },
};

export default orgTypeService;
