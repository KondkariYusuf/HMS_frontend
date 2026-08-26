/**
 * @file permissionHeaders.js
 * @description Helper utility to dynamically resolve module and sub-module headers
 * for backend checkPermission middleware based on logged-in user permissions.
 */

/**
 * Resolves x-module-name and x-submodule-name headers for a given permission code
 * from the stored logged-in user session in localStorage (syncstays_user).
 *
 * @param {string} permissionCode - Exact permission code (e.g., 'AMENITY_READALL')
 * @returns {Object} Request headers object containing 'x-module-name' and 'x-submodule-name' if resolved, or {} if missing/malformed.
 */
export function getPermissionHeaders(permissionCode) {
  if (!permissionCode || typeof permissionCode !== 'string') {
    return {};
  }

  try {
    const rawUser = localStorage.getItem('syncstays_user');
    if (!rawUser) {
      return {};
    }

    const user = JSON.parse(rawUser);
    if (!user || !Array.isArray(user.permissions)) {
      return {};
    }

    const targetPermission = user.permissions.find((perm) => {
      if (typeof perm === 'object' && perm !== null) {
        return perm.code === permissionCode;
      }
      return false;
    });

    if (
      targetPermission &&
      targetPermission.module?.name &&
      targetPermission.subModule?.name
    ) {
      return {
        'x-module-name': targetPermission.module.name,
        'x-submodule-name': targetPermission.subModule.name,
      };
    }

    return {};
  } catch (error) {
    console.error('Error resolving permission headers:', error);
    return {};
  }
}

export default getPermissionHeaders;
