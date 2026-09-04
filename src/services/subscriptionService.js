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
   * GET /api/subscription-plan?page=1&limit=10
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
   * Get subscription plan details by ID
   * GET /api/subscription-plan/:id
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
   * Create subscription plan
   * POST /api/subscription-plan
   * @param {Object} data - { name, description, priceMonthly, priceYearly, trialDays, isActive, modules, resourceLimits }
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
   * @param {string} id
   * @param {Object} data - { name, description, priceMonthly, priceYearly, trialDays, isActive, modules, resourceLimits }
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
   * @param {string} id
   * @param {boolean} isActive
   */
  updateStatus: async (id, isActive) => {
    const res = await fetch(`${getApiBaseUrl()}/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ isActive: Boolean(isActive) }),
    });
    return res.json();
  },

  /**
   * Assign/toggle a single module for plan
   * PATCH /api/subscription-plan/:id/module
   * @param {string} id
   * @param {Object|string} moduleDataOrId - { moduleId, enable } or moduleId
   * @param {boolean} [enableVal=true]
   */
  updateModule: async (id, moduleDataOrId, enableVal = true) => {
    const payload =
      typeof moduleDataOrId === 'object' && moduleDataOrId !== null
        ? {
            moduleId: moduleDataOrId.moduleId || moduleDataOrId.module_id,
            enable: moduleDataOrId.enable !== undefined ? Boolean(moduleDataOrId.enable) : true,
          }
        : {
            moduleId: moduleDataOrId,
            enable: Boolean(enableVal),
          };

    const res = await fetch(`${getApiBaseUrl()}/${id}/module`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  /**
   * Alias for updateModule
   */
  assignModules: async (id, moduleDataOrId, enableVal = true) => {
    return subscriptionService.updateModule(id, moduleDataOrId, enableVal);
  },

  /**
   * Set plan single resource limit
   * PATCH /api/subscription-plan/:id/resource-limit
   * @param {string} id
   * @param {Object|string} codeOrData - { resourceCode, limit } or resourceCode
   * @param {number} [limitVal]
   */
  updateResourceLimit: async (id, codeOrData, limitVal) => {
    const payload =
      typeof codeOrData === 'object' && codeOrData !== null
        ? {
            resourceCode: String(codeOrData.resourceCode).trim(),
            limit: parseInt(codeOrData.limit, 10) || 0,
          }
        : {
            resourceCode: String(codeOrData).trim(),
            limit: parseInt(limitVal, 10) || 0,
          };

    const res = await fetch(`${getApiBaseUrl()}/${id}/resource-limit`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  /**
   * Alias for updateResourceLimit
   */
  setResourceLimits: async (id, codeOrData, limitVal) => {
    return subscriptionService.updateResourceLimit(id, codeOrData, limitVal);
  },

  /**
   * Delete subscription plan by ID
   * DELETE /api/subscription-plan/:id
   * @param {string} id
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
