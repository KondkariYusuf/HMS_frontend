/**
 * @file hotelGuestService.js
 * @description API service mapping for Hotel Guest management.
 * Endpoints (mounted at /api/hotel-guest in backend):
 * - POST /api/hotel-guest
 * - GET /api/hotel-guest
 * - GET /api/hotel-guest/:id
 * - PUT /api/hotel-guest/:id
 * - DELETE /api/hotel-guest/:id
 */
import { backendApi } from '@utils/backendApiClient';
import { getPermissionHeaders } from '@utils/permissionHeaders';

export const HOTEL_GUEST_ENDPOINTS = {
  GET_ALL: '/api/hotel-guest',
  GET_BY_ID: (id) => `/api/hotel-guest/${id}`,
  CREATE: '/api/hotel-guest',
  UPDATE: (id) => `/api/hotel-guest/${id}`,
  DELETE: (id) => `/api/hotel-guest/${id}`,
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

export const hotelGuestService = {
  endpoints: HOTEL_GUEST_ENDPOINTS,

  getAll: (params = {}, options = {}) => {
    const permHeaders = getPermissionHeaders(['HOTEL_GUEST_READALL', 'HOTEL_GUEST_READ']);
    return backendApi.get(
      `${HOTEL_GUEST_ENDPOINTS.GET_ALL}${buildQueryString(params)}`,
      { ...options, headers: { ...permHeaders, ...options?.headers } }
    );
  },

  getById: (id, options = {}) => {
    const permHeaders = getPermissionHeaders(['HOTEL_GUEST_READ', 'HOTEL_GUEST_READALL']);
    return backendApi.get(HOTEL_GUEST_ENDPOINTS.GET_BY_ID(id), {
      ...options,
      headers: { ...permHeaders, ...options?.headers },
    });
  },

  create: (data, options = {}) => {
    const permHeaders = getPermissionHeaders('HOTEL_GUEST_CREATE');
    return backendApi.post(HOTEL_GUEST_ENDPOINTS.CREATE, data, {
      ...options,
      headers: { ...permHeaders, ...options?.headers },
    });
  },

  update: (id, data, options = {}) => {
    const permHeaders = getPermissionHeaders('HOTEL_GUEST_UPDATE');
    return backendApi.put(HOTEL_GUEST_ENDPOINTS.UPDATE(id), data, {
      ...options,
      headers: { ...permHeaders, ...options?.headers },
    });
  },

  delete: (id, options = {}) => {
    const permHeaders = getPermissionHeaders('HOTEL_GUEST_DELETE');
    return backendApi.delete(HOTEL_GUEST_ENDPOINTS.DELETE(id), {
      ...options,
      headers: { ...permHeaders, ...options?.headers },
    });
  },
};

export default hotelGuestService;
