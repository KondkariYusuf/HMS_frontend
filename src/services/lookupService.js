/**
 * @file lookupService.js
 * @description Frontend API integration service for Currency, Country, State & City Lookup Modules.
 * Scanned & matched with Node.js/Express backend (`/api/currency`, `/api/country`, `/api/state`, `/api/city`).
 */

const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
  const cleanBase = envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
  return cleanBase.endsWith('/api') ? cleanBase : `${cleanBase}/api`;
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
    const url = `${baseUrl}/currency`;
    const res = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  /**
   * Update currency settings
   * PUT /api/currency
   */
  updateCurrency: async (data) => {
    const baseUrl = getApiBaseUrl();
    const url = `${baseUrl}/currency`;
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
    const url = `${baseUrl}/country`;
    const res = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  /**
   * Update country settings
   * PUT /api/country
   */
  updateCountry: async (data) => {
    const baseUrl = getApiBaseUrl();
    const url = `${baseUrl}/country`;
    const res = await fetch(url, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  /**
   * Fetch states list
   * GET /api/state
   */
  getStates: async (countryId) => {
    const baseUrl = getApiBaseUrl();
    const url = countryId ? `${baseUrl}/state?countryId=${countryId}` : `${baseUrl}/state`;
    const res = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  /**
   * Fetch city list for dropdowns
   * GET /api/city
   */
  getCities: async (stateId) => {
    const baseUrl = getApiBaseUrl();
    const url = stateId ? `${baseUrl}/city?stateId=${stateId}` : `${baseUrl}/city`;
    const res = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return res.json();
  },
};

export default lookupService;
