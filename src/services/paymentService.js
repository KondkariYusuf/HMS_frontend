/**
 * @file paymentService.js
 * @description API service mapping for Payment management.
 * Endpoints (mounted at /api/payment in backend):
 * - POST /api/payment
 * - GET /api/payment
 * - GET /api/payment/:id
 * - PUT /api/payment/:id
 * - DELETE /api/payment/:id
 */
import { backendApi } from '@utils/backendApiClient';
import { getPermissionHeaders } from '@utils/permissionHeaders';

export const PAYMENT_ENDPOINTS = {
  GET_ALL: '/api/payment',
  GET_BY_ID: (id) => `/api/payment/${id}`,
  CREATE: '/api/payment',
  UPDATE: (id) => `/api/payment/${id}`,
  DELETE: (id) => `/api/payment/${id}`,
};

const buildQueryString = (params = {}) => {
  const query = new window.URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') {
      query.append(key, val);
    }
  });
  const str = query.toString();
  return str ? `?${str}` : '';
};

export const paymentService = {
  endpoints: PAYMENT_ENDPOINTS,

  getAll: (params = {}, options = {}) => {
    const permHeaders = getPermissionHeaders(['PAYMENT_READALL', 'PAYMENT_READ']);
    return backendApi.get(
      `${PAYMENT_ENDPOINTS.GET_ALL}${buildQueryString(params)}`,
      { ...options, headers: { ...permHeaders, ...options?.headers } }
    );
  },

  getById: (id, options = {}) => {
    const permHeaders = getPermissionHeaders(['PAYMENT_READ', 'PAYMENT_READALL']);
    return backendApi.get(PAYMENT_ENDPOINTS.GET_BY_ID(id), {
      ...options,
      headers: { ...permHeaders, ...options?.headers },
    });
  },

  create: (data, options = {}) => {
    const permHeaders = getPermissionHeaders('PAYMENT_CREATE');
    return backendApi.post(PAYMENT_ENDPOINTS.CREATE, data, {
      ...options,
      headers: { ...permHeaders, ...options?.headers },
    });
  },

  update: (id, data, options = {}) => {
    const permHeaders = getPermissionHeaders('PAYMENT_UPDATE');
    return backendApi.put(PAYMENT_ENDPOINTS.UPDATE(id), data, {
      ...options,
      headers: { ...permHeaders, ...options?.headers },
    });
  },

  delete: (id, options = {}) => {
    const permHeaders = getPermissionHeaders('PAYMENT_DELETE');
    return backendApi.delete(PAYMENT_ENDPOINTS.DELETE(id), {
      ...options,
      headers: { ...permHeaders, ...options?.headers },
    });
  },
};

export default paymentService;
