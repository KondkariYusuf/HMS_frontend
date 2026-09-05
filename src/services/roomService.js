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
import { getPermissionHeaders } from '@utils/permissionHeaders';

export const ROOM_ENDPOINTS = {
  GET_ALL: '/api/room',
  GET_BY_ID: (id) => `/api/room/${id}`,
  CREATE: '/api/room',
  UPDATE: (id) => `/api/room/${id}`,
  DELETE: (id) => `/api/room/${id}`,
  BULK_DELETE: '/api/room/bulk-delete',
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
  getAll: (params = {}, options = {}) => {
    const permHeaders = getPermissionHeaders('ROOM_READALL');
    const mergedOptions = {
      ...options,
      headers: {
        ...permHeaders,
        ...options?.headers,
      },
    };
    return backendApi.get(
      `${ROOM_ENDPOINTS.GET_ALL}${buildQueryString(params)}`,
      mergedOptions
    );
  },
  getById: (id, options = {}) => {
    const permHeaders = getPermissionHeaders(['ROOM_READ', 'ROOM_READALL']);
    return backendApi.get(ROOM_ENDPOINTS.GET_BY_ID(id), {
      ...options,
      headers: { ...permHeaders, ...options?.headers },
    });
  },
  create: (data, options = {}) => {
    const permHeaders = getPermissionHeaders('ROOM_CREATE');
    return backendApi.post(ROOM_ENDPOINTS.CREATE, data, {
      ...options,
      headers: { ...permHeaders, ...options?.headers },
    });
  },
  update: (id, data, options = {}) => {
    const permHeaders = getPermissionHeaders('ROOM_UPDATE');
    return backendApi.put(ROOM_ENDPOINTS.UPDATE(id), data, {
      ...options,
      headers: { ...permHeaders, ...options?.headers },
    });
  },
  delete: (id, options = {}) => {
    const permHeaders = getPermissionHeaders('ROOM_DELETE');
    return backendApi.delete(ROOM_ENDPOINTS.DELETE(id), {
      ...options,
      headers: { ...permHeaders, ...options?.headers },
    });
  },
  bulkDelete: (roomIds, options = {}) => {
    const permHeaders = getPermissionHeaders('ROOM_DELETE');
    const mergedOptions = {
      ...options,
      headers: {
        ...permHeaders,
        ...options?.headers,
      },
    };
    return backendApi.post(ROOM_ENDPOINTS.BULK_DELETE, { roomIds }, mergedOptions);
  },
};

export default roomService;
