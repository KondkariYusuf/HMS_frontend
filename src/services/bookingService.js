/**
 * @file bookingService.js
 * @description API service mapping for Booking and Folio management.
 * Endpoints (mounted at /api/booking in backend):
 * - GET /api/booking/availability
 * - POST /api/booking
 * - GET /api/booking
 * - GET /api/booking/:id
 * - PUT /api/booking/:id
 * - POST /api/booking/:id/check-in
 * - POST /api/booking/:id/check-out
 * - POST /api/booking/:id/cancel
 * - GET /api/booking/:id/folio
 * - POST /api/booking/:id/folio/transaction
 * - POST /api/booking/:id/folio/lock
 */
import { backendApi } from '@utils/backendApiClient';
import { getPermissionHeaders } from '@utils/permissionHeaders';

export const BOOKING_ENDPOINTS = {
  GET_AVAILABILITY: '/api/booking/availability',
  GET_ALL: '/api/booking',
  GET_BY_ID: (id) => `/api/booking/${id}`,
  CREATE: '/api/booking',
  UPDATE: (id) => `/api/booking/${id}`,
  CHECK_IN: (id) => `/api/booking/${id}/check-in`,
  CHECK_OUT: (id) => `/api/booking/${id}/check-out`,
  CANCEL: (id) => `/api/booking/${id}/cancel`,
  GET_FOLIO: (id) => `/api/booking/${id}/folio`,
  POST_FOLIO_TRANSACTION: (id) => `/api/booking/${id}/folio/transaction`,
  LOCK_FOLIO: (id) => `/api/booking/${id}/folio/lock`,
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

export const bookingService = {
  endpoints: BOOKING_ENDPOINTS,

  getAvailability: (params = {}, options = {}) => {
    const permHeaders = getPermissionHeaders(['BOOKING_READ_AVAILABILITY', 'BOOKING_READ', 'BOOKING_READALL']);
    return backendApi.get(
      `${BOOKING_ENDPOINTS.GET_AVAILABILITY}${buildQueryString(params)}`,
      { ...options, headers: { ...permHeaders, ...options?.headers } }
    );
  },

  getAll: (params = {}, options = {}) => {
    const permHeaders = getPermissionHeaders(['BOOKING_READALL', 'BOOKING_READ']);
    return backendApi.get(
      `${BOOKING_ENDPOINTS.GET_ALL}${buildQueryString(params)}`,
      { ...options, headers: { ...permHeaders, ...options?.headers } }
    );
  },

  getById: (id, options = {}) => {
    const permHeaders = getPermissionHeaders(['BOOKING_READ', 'BOOKING_READALL']);
    return backendApi.get(BOOKING_ENDPOINTS.GET_BY_ID(id), {
      ...options,
      headers: { ...permHeaders, ...options?.headers },
    });
  },

  create: (data, options = {}) => {
    const permHeaders = getPermissionHeaders('BOOKING_CREATE');
    return backendApi.post(BOOKING_ENDPOINTS.CREATE, data, {
      ...options,
      headers: { ...permHeaders, ...options?.headers },
    });
  },

  update: (id, data, options = {}) => {
    const permHeaders = getPermissionHeaders('BOOKING_UPDATE');
    return backendApi.put(BOOKING_ENDPOINTS.UPDATE(id), data, {
      ...options,
      headers: { ...permHeaders, ...options?.headers },
    });
  },

  checkIn: (id, data = {}, options = {}) => {
    const permHeaders = getPermissionHeaders(['BOOKING_CREATE_CHECK_IN', 'BOOKING_CHECKIN']);
    return backendApi.post(BOOKING_ENDPOINTS.CHECK_IN(id), data, {
      ...options,
      headers: { ...permHeaders, ...options?.headers },
    });
  },

  checkOut: (id, data = {}, options = {}) => {
    const permHeaders = getPermissionHeaders(['BOOKING_CREATE_CHECK_OUT', 'BOOKING_CHECKOUT']);
    return backendApi.post(BOOKING_ENDPOINTS.CHECK_OUT(id), data, {
      ...options,
      headers: { ...permHeaders, ...options?.headers },
    });
  },

  cancel: (id, data = {}, options = {}) => {
    const permHeaders = getPermissionHeaders(['BOOKING_CREATE_CANCEL', 'BOOKING_CANCEL']);
    return backendApi.post(BOOKING_ENDPOINTS.CANCEL(id), data, {
      ...options,
      headers: { ...permHeaders, ...options?.headers },
    });
  },

  getFolio: (id, options = {}) => {
    const permHeaders = getPermissionHeaders(['BOOKING_CREATE_FOLIO/LOCK', 'FOLIO_LOCK', 'BOOKING_READ_FOLIO', 'INVOICE_READALL']);
    return backendApi.get(BOOKING_ENDPOINTS.GET_FOLIO(id), {
      ...options,
      headers: { ...permHeaders, ...options?.headers },
    });
  },

  postFolioTransaction: (id, data, options = {}) => {
    const permHeaders = getPermissionHeaders(['BOOKING_CREATE_FOLIO/TRANSACTION', 'FOLIO_CHARGE']);
    return backendApi.post(BOOKING_ENDPOINTS.POST_FOLIO_TRANSACTION(id), data, {
      ...options,
      headers: { ...permHeaders, ...options?.headers },
    });
  },

  lockFolio: (id, data = {}, options = {}) => {
    const permHeaders = getPermissionHeaders(['BOOKING_CREATE_FOLIO/LOCK', 'FOLIO_LOCK']);
    return backendApi.post(BOOKING_ENDPOINTS.LOCK_FOLIO(id), data, {
      ...options,
      headers: { ...permHeaders, ...options?.headers },
    });
  },
};

export default bookingService;
