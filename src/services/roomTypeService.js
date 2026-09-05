/**
 * @file roomTypeService.js
 * @description API service configuration structure for Room Type management.
 * Endpoints:
 * - GET /api/room-type
 * - GET /api/room-type/:id
 * - POST /api/room-type
 * - PUT /api/room-type/:id
 * - DELETE /api/room-type/:id
 */
import { backendApi } from '@utils/backendApiClient';
import { getPermissionHeaders } from '@utils/permissionHeaders';

export const ROOM_TYPE_ENDPOINTS = {
  GET_ALL: '/api/room-type',
  GET_BY_ID: (id) => `/api/room-type/${id}`,
  CREATE: '/api/room-type',
  UPDATE: (id) => `/api/room-type/${id}`,
  DELETE: (id) => `/api/room-type/${id}`,
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

export const roomTypeService = {
  endpoints: ROOM_TYPE_ENDPOINTS,
  getAll: (params = {}, options = {}) => {
    const permHeaders = getPermissionHeaders('ROOM_TYPE_READALL');
    const mergedOptions = {
      ...options,
      headers: {
        ...permHeaders,
        ...options?.headers,
      },
    };
    return backendApi.get(
      `${ROOM_TYPE_ENDPOINTS.GET_ALL}${buildQueryString(params)}`,
      mergedOptions
    );
  },
  getById: (id, options = {}) => {
    const permHeaders = getPermissionHeaders(['ROOM_TYPE_READ', 'ROOM_TYPE_READALL']);
    return backendApi.get(ROOM_TYPE_ENDPOINTS.GET_BY_ID(id), {
      ...options,
      headers: { ...permHeaders, ...options?.headers },
    });
  },
  create: (data, options = {}) => {
    const permHeaders = getPermissionHeaders('ROOM_TYPE_CREATE');
    return backendApi.post(ROOM_TYPE_ENDPOINTS.CREATE, data, {
      ...options,
      headers: { ...permHeaders, ...options?.headers },
    });
  },
  update: (id, data, options = {}) => {
    const permHeaders = getPermissionHeaders('ROOM_TYPE_UPDATE');
    return backendApi.put(ROOM_TYPE_ENDPOINTS.UPDATE(id), data, {
      ...options,
      headers: { ...permHeaders, ...options?.headers },
    });
  },
  delete: (id, options = {}) => {
    const permHeaders = getPermissionHeaders('ROOM_TYPE_DELETE');
    return backendApi.delete(ROOM_TYPE_ENDPOINTS.DELETE(id), {
      ...options,
      headers: { ...permHeaders, ...options?.headers },
    });
  },
};

export default roomTypeService;
