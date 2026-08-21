/**
 * @file lookupService.js
 * @description Frontend API integration service for Currency & Country Lookup Modules.
 * Scanned & matched with Node.js/Express backend (`/api/currency` and `/api/country`).
 */

const getApiBaseUrl = () => {
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
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

export const lookupService = {
  /**
   * Fetch currency list for dropdowns
   * GET /api/currency
   */
  getCurrencies: async () => {
    const baseUrl = getApiBaseUrl();
    const url = baseUrl.endsWith('/') ? `${baseUrl}currency` : `${baseUrl}/currency`;
    const res = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  /**
   * Update currency settings
   * PUT /api/currency
   * @param {Object} data
   */
  updateCurrency: async (data) => {
    const baseUrl = getApiBaseUrl();
    const url = baseUrl.endsWith('/') ? `${baseUrl}currency` : `${baseUrl}/currency`;
    const res = await fetch(url, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  /**
   * Fetch country list for dropdowns
   * GET /api/country
   */
  getCountries: async () => {
    const baseUrl = getApiBaseUrl();
    const url = baseUrl.endsWith('/') ? `${baseUrl}country` : `${baseUrl}/country`;
    const res = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  /**
   * Update country settings
   * PUT /api/country
   * @param {Object} data
   */
  updateCountry: async (data) => {
    const baseUrl = getApiBaseUrl();
    const url = baseUrl.endsWith('/') ? `${baseUrl}country` : `${baseUrl}/country`;
    const res = await fetch(url, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },
};

export default lookupService;
