/**
 * @file permissionHeaders.js
 * @description Helper utility to dynamically resolve module and sub-module headers
 * for backend checkPermission middleware based on logged-in user permissions.
 */

/**
 * Resolves x-module-name and x-submodule-name headers for a given permission code or list of codes
 * from the stored logged-in user session in localStorage (syncstays_user).
 *
 * @param {string|string[]} permissionCode - Exact permission code or array of code candidates (e.g. 'BOOKING_READALL')
 * @returns {Object} Request headers object containing 'x-module-name' and 'x-submodule-name' if resolved, or {} if missing/malformed.
 */
export function getPermissionHeaders(permissionCode) {
  if (!permissionCode) {
    return {};
  }

  const codesToTry = Array.isArray(permissionCode)
    ? permissionCode
    : [permissionCode];

  try {
    const rawUser = localStorage.getItem('syncstays_user');
    if (!rawUser) {
      return {};
    }

    const user = JSON.parse(rawUser);
    if (!user || !Array.isArray(user.permissions)) {
      return {};
    }

    let targetPermission = null;

    for (const code of codesToTry) {
      if (typeof code !== 'string') continue;

      targetPermission = user.permissions.find((perm) => {
        if (typeof perm === 'object' && perm !== null) {
          if (perm.code === code) return true;
          if (perm.code === `${code}ALL`) return true;
          if (code.endsWith('ALL') && perm.code === code.replace(/ALL$/, '')) return true;
        }
        return false;
      });

      if (targetPermission) break;
    }

    // Fallback: match by prefix if still not found
    if (!targetPermission && typeof codesToTry[0] === 'string') {
      const mainPrefix = codesToTry[0].split('_')[0]; // e.g. "BOOKING"
      targetPermission = user.permissions.find(
        (perm) =>
          typeof perm === 'object' &&
          perm !== null &&
          perm.code &&
          perm.code.startsWith(mainPrefix) &&
          perm.module?.name &&
          perm.subModule?.name
      );
    }

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
