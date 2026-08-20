/**
 * @file roomService.js
 * @description API service configuration structure for Room management.
 * Endpoints:
 * - GET /api/room
 * - GET /api/room/:id
 * - POST /api/room
 * - PUT /api/room/:id
 * - DELETE /api/room/:id
 */
import { backendApi } from '@utils/backendApiClient';

export const ROOM_ENDPOINTS = {
  GET_ALL: '/api/room',
  GET_BY_ID: (id) => `/api/room/${id}`,
  CREATE: '/api/room',
  UPDATE: (id) => `/api/room/${id}`,
  DELETE: (id) => `/api/room/${id}`,
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

export const roomService = {
  endpoints: ROOM_ENDPOINTS,
  getAll: (params = {}, options) =>
    backendApi.get(`${ROOM_ENDPOINTS.GET_ALL}${buildQueryString(params)}`, options),
  getById: (id, options) =>
    backendApi.get(ROOM_ENDPOINTS.GET_BY_ID(id), options),
  create: (data, options) =>
    backendApi.post(ROOM_ENDPOINTS.CREATE, data, options),
  update: (id, data, options) =>
    backendApi.put(ROOM_ENDPOINTS.UPDATE(id), data, options),
  delete: (id, options) =>
    backendApi.delete(ROOM_ENDPOINTS.DELETE(id), options),
};

export default roomService;
