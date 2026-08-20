/**
 * @file extraServiceService.js
 * @description API service configuration structure for Extra Service management.
 * Endpoints:
 * - GET /api/extra-service-for-hotel
 * - GET /api/extra-service-for-hotel/:id
 * - POST /api/extra-service-for-hotel
 * - PUT /api/extra-service-for-hotel/:id
 * - DELETE /api/extra-service-for-hotel/:id
 */
import { backendApi } from '@utils/backendApiClient';

export const EXTRA_SERVICE_ENDPOINTS = {
  GET_ALL: '/api/extra-service-for-hotel',
  GET_BY_ID: (id) => `/api/extra-service-for-hotel/${id}`,
  CREATE: '/api/extra-service-for-hotel',
  UPDATE: (id) => `/api/extra-service-for-hotel/${id}`,
  DELETE: (id) => `/api/extra-service-for-hotel/${id}`,
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

export const extraServiceService = {
  endpoints: EXTRA_SERVICE_ENDPOINTS,
  getAll: (params = {}, options) =>
    backendApi.get(`${EXTRA_SERVICE_ENDPOINTS.GET_ALL}${buildQueryString(params)}`, options),
  getById: (id, options) =>
    backendApi.get(EXTRA_SERVICE_ENDPOINTS.GET_BY_ID(id), options),
  create: (data, options) =>
    backendApi.post(EXTRA_SERVICE_ENDPOINTS.CREATE, data, options),
  update: (id, data, options) =>
    backendApi.put(EXTRA_SERVICE_ENDPOINTS.UPDATE(id), data, options),
  delete: (id, options) =>
    backendApi.delete(EXTRA_SERVICE_ENDPOINTS.DELETE(id), options),
};

export default extraServiceService;
