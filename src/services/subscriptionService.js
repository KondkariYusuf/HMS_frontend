/**
 * @file subscriptionService.js
 * @description Frontend API integration service for Subscription Plan Module.
 * Scanned & matched with Node.js/Express backend (`/api/subscription-plan`).
 */

const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  const cleanBase = envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
  const apiBase = cleanBase.endsWith('/api') ? cleanBase : `${cleanBase}/api`;
  return `${apiBase}/subscription-plan`;
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

export const subscriptionService = {
  /**
   * List all subscription plans
   * GET /api/subscription-plan?status=active
   */
  getAll: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const baseUrl = getApiBaseUrl();
    const url = query ? `${baseUrl}?${query}` : baseUrl;
    const res = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  /**
   * Get subscription plan details by ID
   * GET /api/subscription-plan/:id
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
   * Create subscription plan
   * POST /api/subscription-plan
   * @param {Object} data { planName, price, duration, features }
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
   * Update subscription plan info
   * PUT /api/subscription-plan/:id
   * @param {string|number} id
   * @param {Object} data { planName, price, duration }
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
   * Toggle subscription plan status
   * PATCH /api/subscription-plan/:id/status
   * @param {string|number} id
   * @param {boolean} status
   */
  updateStatus: async (id, status) => {
    const res = await fetch(`${getApiBaseUrl()}/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    return res.json();
  },

  /**
   * Assign modules to plan
   * PATCH /api/subscription-plan/:id/module
   * @param {string|number} id
   * @param {Array<string|number>} moduleIds
   */
  assignModules: async (id, moduleIds) => {
    const res = await fetch(`${getApiBaseUrl()}/${id}/module`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ moduleIds }),
    });
    return res.json();
  },

  /**
   * Set plan resource limits
   * PATCH /api/subscription-plan/:id/resource-limit
   * @param {string|number} id
   * @param {Object} limits { maxRooms, maxUsers }
   */
  setResourceLimits: async (id, limits) => {
    const res = await fetch(`${getApiBaseUrl()}/${id}/resource-limit`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(limits),
    });
    return res.json();
  },

  /**
   * Delete subscription plan by ID
   * DELETE /api/subscription-plan/:id
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

export default subscriptionService;
