/**
 * @file organizationService.js
 * @description Frontend API integration service for Organization Module.
 * Scanned & matched with Node.js/Express backend (`/api/organization`).
 */

const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  const cleanBase = envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
  const apiBase = cleanBase.endsWith('/api') ? cleanBase : `${cleanBase}/api`;
  return `${apiBase}/organization`;
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

export const organizationService = {
  /**
   * List all organizations
   * GET /api/organization?page=1&limit=10&search=
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
   * Get organization details by ID
   * GET /api/organization/:id
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
   * Register an organization
   * POST /api/organization
   * @param {Object} data { name, email, phone, organizationTypeId, address }
   */
  create: async (data) => {
    const res = await fetch(getApiBaseUrl(), {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  /**
   * Update organization info
   * PUT /api/organization/:id
   * @param {string|number} id
   * @param {Object} data { name, phone, address }
   */
  update: async (id, data) => {
    const res = await fetch(`${getApiBaseUrl()}/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  /**
   * Delete organization by ID
   * DELETE /api/organization/:id
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

export default organizationService;
