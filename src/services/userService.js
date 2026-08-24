/**
 * @file userService.js
 * @description User management frontend API integration service (/api/user)
 */

const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
  const cleanBase = envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
  return cleanBase.endsWith('/api') ? `${cleanBase}/user` : `${cleanBase}/api/user`;
};

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken') || localStorage.getItem('syncstays_token');
  const activeBranchId = localStorage.getItem('syncstays_branch_id');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(activeBranchId ? { 'x-branch-id': activeBranchId } : {}),
  };
};

export const userService = {
  /**
   * Get paginated user list
   * GET /api/user?page=1&limit=10&roleId=&search=
   */
  getAll: async (params = {}) => {
    try {
      const query = new URLSearchParams(params).toString();
      const baseUrl = getApiBaseUrl();
      const url = query ? `${baseUrl}?${query}` : baseUrl;
      const res = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return await res.json();
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  /**
   * Get user details by ID
   * GET /api/user/:id
   */
  getById: async (id) => {
    try {
      const res = await fetch(`${getApiBaseUrl()}/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return await res.json();
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  /**
   * Create new user
   * POST /api/user
   */
  create: async (data) => {
    try {
      const res = await fetch(getApiBaseUrl(), {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  /**
   * Update user details
   * PUT /api/user/:id
   */
  update: async (id, data) => {
    try {
      const res = await fetch(`${getApiBaseUrl()}/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  /**
   * Toggle user active status
   * PATCH /api/user/:id/status
   */
  updateStatus: async (id, status) => {
    try {
      const res = await fetch(`${getApiBaseUrl()}/${id}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      });
      return await res.json();
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  /**
   * User change password (Profile section)
   * PATCH /api/user/change-password
   */
  changePassword: async (currentPassword, newPassword) => {
    try {
      const res = await fetch(`${getApiBaseUrl()}/change-password`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      return await res.json();
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  /**
   * Delete user by ID
   * DELETE /api/user/:id
   */
  delete: async (id) => {
    try {
      const res = await fetch(`${getApiBaseUrl()}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return await res.json();
    } catch (err) {
      return { success: false, message: err.message };
    }
  },
};

export default userService;
