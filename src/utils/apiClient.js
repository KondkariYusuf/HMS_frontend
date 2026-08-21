/**
 * @file apiClient.js
 * @description Central API client wrapper for SyncStays platform.
 * Conforms to SyncStays REST conventions documented in backendMD (Base path: /api/v1).
 * Handles JWT Bearer authorization, multi-tenant branch context (x-branch-id),
 * and standard JSON response envelopes ({ success, message, data, meta }).
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

/**
 * Standard API Error Class
 */
export class ApiError extends Error {
  constructor(message, status, code = 'API_ERROR', errors = []) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.errors = errors;
  }
}

/**
 * Core Request Fetcher
 *
 * @param {string} endpoint - API route endpoint (e.g., '/bookings')
 * @param {Object} [options={}] - Fetch configuration options
 * @returns {Promise<{data: any, meta: any, message: string}>}
 */
export async function apiRequest(endpoint, options = {}) {
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
    : `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, config);
    const responseText = await response.text();
    let result;

    try {
      result = responseText ? JSON.parse(responseText) : {};
    } catch {
      throw new ApiError(
        'Notification service is unavailable. Start the backend API or configure VITE_API_BASE_URL.',
        response.status,
        'INVALID_API_RESPONSE'
      );
    }

    if (!response.ok || result.success === false) {
      const errorMsg = result.message || 'An unexpected API error occurred.';
      const errorCode = result.meta?.code || `HTTP_${response.status}`;
      const validationErrors = result.meta?.errors || [];

      throw new ApiError(
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
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error.message || 'Network communication failure.',
      500,
      'NETWORK_ERROR'
    );
  }
}

export const api = {
  get: (endpoint, options) =>
    apiRequest(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options) =>
    apiRequest(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    }),
  patch: (endpoint, body, options) =>
    apiRequest(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body),
    }),
  delete: (endpoint, options) =>
    apiRequest(endpoint, { ...options, method: 'DELETE' }),
};

export default api;
