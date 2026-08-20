/**
 * @file backendApiClient.js
 * @description Centralized API client for upcoming backend integrations.
 * Resolves API requests directly against VITE_API_BASE_URL (http://localhost:5000)
 * without automatically appending /api/v1 prefix.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

/**
 * Standard API Error Class
 */
export class BackendApiError extends Error {
  constructor(message, status, code = 'API_ERROR', errors = []) {
    super(message);
    this.name = 'BackendApiError';
    this.status = status;
    this.code = code;
    this.errors = errors;
  }
}

/**
 * Core Request Fetcher for Backend Services
 *
 * @param {string} endpoint - API route endpoint (e.g., '/api/v1/hotel/rooms')
 * @param {Object} [options={}] - Fetch configuration options
 * @returns {Promise<{data: any, meta: any, message: string}>}
 */
export async function backendApiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('syncstays_token');
  const activeBranchId = localStorage.getItem('syncstays_branch_id');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(activeBranchId ? { 'x-branch-id': activeBranchId } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  const url = endpoint.startsWith('http')
    ? endpoint
    : `${API_BASE_URL.replace(/\/$/, '')}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  try {
    const response = await fetch(url, config);
    const result = await response.json();

    if (!response.ok || result.success === false) {
      const errorMsg = result.message || 'An unexpected API error occurred.';
      const errorCode = result.meta?.code || `HTTP_${response.status}`;
      const validationErrors = result.meta?.errors || [];

      throw new BackendApiError(
        errorMsg,
        response.status,
        errorCode,
        validationErrors
      );
    }

    return {
      data: result.data,
      meta: result.meta || null,
      message: result.message || 'Success',
    };
  } catch (error) {
    if (error instanceof BackendApiError) {
      throw error;
    }
    throw new BackendApiError(
      error.message || 'Network communication failure.',
      500,
      'NETWORK_ERROR'
    );
  }
}

export const backendApi = {
  get: (endpoint, options) =>
    backendApiRequest(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options) =>
    backendApiRequest(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    }),
  put: (endpoint, body, options) =>
    backendApiRequest(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    }),
  patch: (endpoint, body, options) =>
    backendApiRequest(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body),
    }),
  delete: (endpoint, options) =>
    backendApiRequest(endpoint, { ...options, method: 'DELETE' }),
};

export default backendApi;
