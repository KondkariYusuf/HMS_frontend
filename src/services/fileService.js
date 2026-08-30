/**
 * @file fileService.js
 * @description File Upload backend API integration service (/api/file/single)
 */

const getApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
  const cleanBase = envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
  return cleanBase.endsWith('/api') ? `${cleanBase}/file/single` : `${cleanBase}/api/file/single`;
};

export const fileService = {
  /**
   * Upload single file
   * POST /api/file/single
   * @param {File} fileObject
   */
  uploadSingle: async (fileObject) => {
    try {
      const formData = new FormData();
      formData.append('file', fileObject);

      const token = localStorage.getItem('authToken') || localStorage.getItem('syncstays_token');
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(getApiUrl(), {
        method: 'POST',
        headers,
        body: formData,
      });
      return await res.json();
    } catch (err) {
      return { success: false, message: err.message || 'File upload failed' };
    }
  },
};

export default fileService;
