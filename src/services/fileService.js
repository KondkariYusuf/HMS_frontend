/**
 * @file fileService.js
 * @description File Upload backend API integration service (/api/file & /api/file/single)
 */
import { getPermissionHeaders } from '@utils/permissionHeaders';

const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  return envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
};

const getHeaders = (permissionCode) => {
  const token = localStorage.getItem('syncstays_token') || localStorage.getItem('authToken');
  const activeBranchId = localStorage.getItem('syncstays_branch_id');
  const permHeaders = getPermissionHeaders(permissionCode);

  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(activeBranchId ? { 'x-branch-id': activeBranchId } : {}),
    ...permHeaders,
  };
};

export const fileService = {
  /**
   * Upload single file
   * POST /api/file/single (or POST /api/file)
   * @param {File} fileObject
   * @returns {Promise<{success: boolean, fileId?: string, data?: any, message?: string}>}
   */
  uploadSingle: async (fileObject) => {
    try {
      const formData = new FormData();
      formData.append('files', fileObject);

      const headers = getHeaders(['FILE_CREATE_SINGLE', 'FILE_CREATE']);
      const url = `${getBaseUrl()}/api/file/single`;

      const res = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
      });

      const result = await res.json();
      if (!res.ok || result.success === false) {
        throw new Error(result.message || 'Single file upload failed');
      }

      const fileId =
        result.data?.files?.id ||
        result.data?.fileIds?.[0] ||
        result.data?.id ||
        null;

      return {
        success: true,
        fileId,
        data: result.data,
        message: result.message || 'File uploaded successfully',
      };
    } catch (err) {
      console.error('File upload single error:', err);
      return { success: false, message: err.message || 'File upload failed' };
    }
  },

  /**
   * Upload multiple files at once
   * POST /api/file
   * @param {File[]|FileList} filesArray
   * @returns {Promise<{success: boolean, fileIds?: string[], data?: any, message?: string}>}
   */
  uploadMultiple: async (filesArray) => {
    try {
      const formData = new FormData();
      const files = Array.from(filesArray);

      if (files.length === 0) {
        return { success: true, fileIds: [] };
      }

      files.forEach((file) => {
        formData.append('files', file);
      });

      const headers = getHeaders(['FILE_CREATE', 'FILE_CREATE_SINGLE']);
      const url = `${getBaseUrl()}/api/file`;

      const res = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
      });

      const result = await res.json();
      if (!res.ok || result.success === false) {
        throw new Error(result.message || 'Batch file upload failed');
      }

      const fileIds =
        result.data?.fileIds ||
        (result.data?.files ? (Array.isArray(result.data.files) ? result.data.files.map(f => f.id) : [result.data.files.id]) : []) ||
        [];

      return {
        success: true,
        fileIds,
        data: result.data,
        message: result.message || 'Files uploaded successfully',
      };
    } catch (err) {
      console.error('File upload multiple error:', err);
      return { success: false, message: err.message || 'Failed to upload files' };
    }
  },
};

export default fileService;
