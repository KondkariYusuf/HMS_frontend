/**
 * @file lookupService.js
 * @description Frontend API integration service for Currency, Country, State & City Lookup Modules.
 * Scanned & matched with Node.js/Express backend (`/api/currency`, `/api/country`, `/api/state`, `/api/city`).
 */

const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
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

const buildQueryString = (params = {}) => {
  const cleanParams = {};
  Object.keys(params).forEach((key) => {
    if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
      cleanParams[key] = params[key];
    }
  });
  return new window.URLSearchParams(cleanParams).toString();
};

export const lookupService = {
  /**
   * Fetch currency list for dropdowns & configurations
   * GET /api/currency
   * @param {Object} [params={}] - { page, limit, fetchAll, search, getAllCurrency, countryData }
   */
  getCurrencies: async (params = {}) => {
    const baseUrl = getApiBaseUrl();
    const query = buildQueryString(params);
    const url = query ? `${baseUrl}/currency?${query}` : `${baseUrl}/currency`;
    const res = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  /**
   * Update / activate currencies (batch activation)
   * PUT /api/currency
   * @param {Object} data - { ids: string[] }
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
   * Fetch country list for dropdowns & configurations
   * GET /api/country
   * @param {Object} [params={}] - { page, limit, fetchAll, search, getAllCountry, currencyData }
   */
  getCountries: async (params = {}) => {
    const baseUrl = getApiBaseUrl();
    const query = buildQueryString(params);
    const url = query ? `${baseUrl}/country?${query}` : `${baseUrl}/country`;
    const res = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  /**
   * Update / activate countries (batch activation)
   * PUT /api/country
   * @param {Object} data - { ids: string[] }
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
   * Fetch states list (optionally filtered by countryId)
   * GET /api/state
   * @param {string|Object} [countryIdOrParams] - Country UUID string or params object
   * @param {Object} [additionalParams={}] - { page, limit, fetchAll, search, getAllState, countryData }
   */
  getStates: async (countryIdOrParams, additionalParams = {}) => {
    const baseUrl = getApiBaseUrl();
    let mergedParams = {};
    if (typeof countryIdOrParams === 'string') {
      mergedParams = { countryId: countryIdOrParams, ...additionalParams };
    } else if (typeof countryIdOrParams === 'object' && countryIdOrParams !== null) {
      mergedParams = { ...countryIdOrParams, ...additionalParams };
    } else {
      mergedParams = { ...additionalParams };
    }

    const query = buildQueryString(mergedParams);
    const url = query ? `${baseUrl}/state?${query}` : `${baseUrl}/state`;
    const res = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  /**
   * Update / activate states (batch activation)
   * PUT /api/state
   * @param {Object} data - { ids: string[] }
   */
  updateState: async (data) => {
    const baseUrl = getApiBaseUrl();
    const url = `${baseUrl}/state`;
    const res = await fetch(url, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  /**
   * Fetch city list for dropdowns (optionally filtered by stateId / countryId)
   * GET /api/city
   * @param {string|Object} [stateIdOrParams] - State UUID string or params object
   * @param {Object} [additionalParams={}] - { page, limit, fetchAll, search, getAllCity, stateData, countryData }
   */
  getCities: async (stateIdOrParams, additionalParams = {}) => {
    const baseUrl = getApiBaseUrl();
    let mergedParams = {};
    if (typeof stateIdOrParams === 'string') {
      mergedParams = { stateId: stateIdOrParams, ...additionalParams };
    } else if (typeof stateIdOrParams === 'object' && stateIdOrParams !== null) {
      mergedParams = { ...stateIdOrParams, ...additionalParams };
    } else {
      mergedParams = { ...additionalParams };
    }

    const query = buildQueryString(mergedParams);
    const url = query ? `${baseUrl}/city?${query}` : `${baseUrl}/city`;
    const res = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  /**
   * Update / activate cities (batch activation)
   * PUT /api/city
   * @param {Object} data - { ids: string[] }
   */
  updateCity: async (data) => {
    const baseUrl = getApiBaseUrl();
    const url = `${baseUrl}/city`;
    const res = await fetch(url, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },
};

export default lookupService;
