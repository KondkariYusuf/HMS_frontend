/**
 * @file invoiceService.js
 * @description API service mapping for Invoice management.
 * Endpoints (mounted at /api/invoice in backend):
 * - POST /api/invoice
 * - GET /api/invoice
 * - GET /api/invoice/:id
 * - GET /api/invoice/:id/pdf
 * - PUT /api/invoice/:id
 * - DELETE /api/invoice/:id
 */
import { backendApi } from '@utils/backendApiClient';
import { getPermissionHeaders } from '@utils/permissionHeaders';

export const INVOICE_ENDPOINTS = {
  GET_ALL: '/api/invoice',
  GET_BY_ID: (id) => `/api/invoice/${id}`,
  GET_PDF: (id) => `/api/invoice/${id}/pdf`,
  CREATE: '/api/invoice',
  UPDATE: (id) => `/api/invoice/${id}`,
  DELETE: (id) => `/api/invoice/${id}`,
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

export const invoiceService = {
  endpoints: INVOICE_ENDPOINTS,

  getAll: (params = {}, options = {}) => {
    const permHeaders = getPermissionHeaders(['INVOICE_READALL', 'INVOICE_READ']);
    return backendApi.get(
      `${INVOICE_ENDPOINTS.GET_ALL}${buildQueryString(params)}`,
      { ...options, headers: { ...permHeaders, ...options?.headers } }
    );
  },

  getById: (id, options = {}) => {
    const permHeaders = getPermissionHeaders(['INVOICE_READ', 'INVOICE_READALL']);
    return backendApi.get(INVOICE_ENDPOINTS.GET_BY_ID(id), {
      ...options,
      headers: { ...permHeaders, ...options?.headers },
    });
  },

  getPdf: (id, options = {}) => {
    const permHeaders = getPermissionHeaders(['INVOICE_READ_PDF', 'INVOICE_READ']);
    return backendApi.get(INVOICE_ENDPOINTS.GET_PDF(id), {
      ...options,
      headers: { ...permHeaders, ...options?.headers },
    });
  },

  create: (data, options = {}) => {
    const permHeaders = getPermissionHeaders('INVOICE_CREATE');
    return backendApi.post(INVOICE_ENDPOINTS.CREATE, data, {
      ...options,
      headers: { ...permHeaders, ...options?.headers },
    });
  },

  update: (id, data, options = {}) => {
    const permHeaders = getPermissionHeaders('INVOICE_UPDATE');
    return backendApi.put(INVOICE_ENDPOINTS.UPDATE(id), data, {
      ...options,
      headers: { ...permHeaders, ...options?.headers },
    });
  },

  delete: (id, options = {}) => {
    const permHeaders = getPermissionHeaders('INVOICE_DELETE');
    return backendApi.delete(INVOICE_ENDPOINTS.DELETE(id), {
      ...options,
      headers: { ...permHeaders, ...options?.headers },
    });
  },
};

export default invoiceService;
