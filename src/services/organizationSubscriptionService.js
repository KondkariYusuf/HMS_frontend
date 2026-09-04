/**
 * @file organizationSubscriptionService.js
 * @description Frontend API integration service for Organization Subscription Module.
 * Scanned & matched with Node.js/Express backend (`/api/organization-subscription`).
 */

const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  const cleanBase = envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
  const apiBase = cleanBase.endsWith('/api') ? cleanBase : `${cleanBase}/api`;
  return `${apiBase}/organization-subscription`;
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

export const organizationSubscriptionService = {
  /**
   * List all organization subscriptions
   * GET /api/organization-subscription
   * @param {Object} params - { page, limit, fetchAll, search, status, organizationId, subscriptionPlanId }
   */
  getAll: async (params = {}) => {
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
    return res.json();
  },

  /**
   * Get organization subscription details by ID
   * GET /api/organization-subscription/:id
   * @param {string} id
   */
  getById: async (id) => {
    const res = await fetch(`${getApiBaseUrl()}/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  /**
   * Create an organization subscription
   * POST /api/organization-subscription
   * @param {Object} data - { organizationId, subscriptionPlanId, status, startDate, endDate }
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
   * Update organization subscription
   * PUT /api/organization-subscription/:id
   * @param {string} id
   * @param {Object} data - { subscriptionPlanId, status, startDate, endDate }
   */
  update: async (id, data) => {
    const res = await fetch(`${getApiBaseUrl()}/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },
};

export default organizationSubscriptionService;
