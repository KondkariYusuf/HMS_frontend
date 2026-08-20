/**
 * @file amenityService.js
 * @description API service configuration structure for Amenity management.
 * Endpoints:
 * - GET /api/amenity
 * - GET /api/amenity/:id
 * - POST /api/amenity
 * - PUT /api/amenity/:id
 * - DELETE /api/amenity/:id
 */
import { backendApi } from '@utils/backendApiClient';

export const AMENITY_ENDPOINTS = {
  GET_ALL: '/api/amenity',
  GET_BY_ID: (id) => `/api/amenity/${id}`,
  CREATE: '/api/amenity',
  UPDATE: (id) => `/api/amenity/${id}`,
  DELETE: (id) => `/api/amenity/${id}`,
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

export const amenityService = {
  endpoints: AMENITY_ENDPOINTS,
  getAll: (params = {}, options) =>
    backendApi.get(`${AMENITY_ENDPOINTS.GET_ALL}${buildQueryString(params)}`, options),
  getById: (id, options) =>
    backendApi.get(AMENITY_ENDPOINTS.GET_BY_ID(id), options),
  create: (data, options) =>
    backendApi.post(AMENITY_ENDPOINTS.CREATE, data, options),
  update: (id, data, options) =>
    backendApi.put(AMENITY_ENDPOINTS.UPDATE(id), data, options),
  delete: (id, options) =>
    backendApi.delete(AMENITY_ENDPOINTS.DELETE(id), options),
};

export default amenityService;
