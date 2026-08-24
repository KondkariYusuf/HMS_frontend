/**
 * @file authService.js
 * @description Authentication service bound to HMS Node.js/Express Backend (/api/auth)
 */

const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  const cleanBase = envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
  return cleanBase.endsWith('/api') ? `${cleanBase}/auth` : `${cleanBase}/api/auth`;
};

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken') || localStorage.getItem('syncstays_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

export const authService = {
  /**
   * Step 1: User Login with Email/Phone & Password
   * POST /api/auth/login
   * Backend validator expects: { identifier, password }
   */
  login: async (identifier, password) => {
    try {
      const res = await fetch(`${getApiBaseUrl()}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await res.json();
      if (data.data?.token || data.token || data.accessToken) {
        const token = data.data?.token || data.token || data.accessToken;
        const user = data.data?.user || data.user || { email: identifier };
        localStorage.setItem('authToken', token);
        localStorage.setItem('syncstays_token', token);
        localStorage.setItem('syncstays_user', JSON.stringify(user));
      }
      return data;
    } catch (err) {
      return { success: false, message: err.message || 'Network error during login' };
    }
  },

  /**
   * Step 2: Verify OTP
   * POST /api/auth/verify-otp
   * Backend validator expects: { email, otp, purpose }
   */
  verifyOtp: async (email, otp, purpose = 'LOGIN') => {
    try {
      const res = await fetch(`${getApiBaseUrl()}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, purpose }),
      });
      const data = await res.json();
      if (data.data?.token || data.token || data.accessToken) {
        const token = data.data?.token || data.token || data.accessToken;
        const user = data.data?.user || data.user || { email };
        localStorage.setItem('authToken', token);
        localStorage.setItem('syncstays_token', token);
        localStorage.setItem('syncstays_user', JSON.stringify(user));
      }
      return data;
    } catch (err) {
      return { success: false, message: err.message || 'Error verifying OTP' };
    }
  },

  /**
   * Initiate Forgot Password (triggers OTP to email)
   * POST /api/auth/forgot-password
   * Backend validator expects: { email }
   */
  forgotPassword: async (email) => {
    try {
      const res = await fetch(`${getApiBaseUrl()}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      return await res.json();
    } catch (err) {
      return { success: false, message: err.message || 'Error sending reset OTP' };
    }
  },

  /**
   * Complete Password Reset with OTP & New Password
   * POST /api/auth/reset-password
   * Backend validator expects: { email, otp, newPassword }
   */
  resetPassword: async (email, otp, newPassword) => {
    try {
      const res = await fetch(`${getApiBaseUrl()}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      return await res.json();
    } catch (err) {
      return { success: false, message: err.message || 'Error resetting password' };
    }
  },

  /**
   * Change Password
   * POST /api/auth/change-password
   * Backend validator expects: { oldPassword, newPassword }
   */
  changePassword: async (oldPassword, newPassword) => {
    try {
      const res = await fetch(`${getApiBaseUrl()}/change-password`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      return await res.json();
    } catch (err) {
      return { success: false, message: err.message || 'Error changing password' };
    }
  },

  /**
   * Logout user and clear session
   * POST /api/auth/logout
   */
  logout: async () => {
    try {
      await fetch(`${getApiBaseUrl()}/logout`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
    } catch (err) {
      console.warn('Logout request failed:', err);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('syncstays_token');
      localStorage.removeItem('syncstays_user');
    }
  },
};

// Helper function for user registration
export const registerUser = async (fullName, email, phone, password, organizationId, roleId) => {
  const nameParts = (fullName || '').trim().split(' ');
  const firstName = nameParts[0] || 'User';
  const lastName = nameParts.slice(1).join(' ') || '';

  try {
    const envUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    const cleanBase = envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
    const apiBase = cleanBase.endsWith('/api') ? cleanBase : `${cleanBase}/api`;
    const userUrl = `${apiBase}/user`;
    const orgUrl = `${apiBase}/organization`;

    const token = localStorage.getItem('authToken') || localStorage.getItem('syncstays_token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };

    let targetOrgId = organizationId;

    // Auto-fetch or create organization if not provided
    if (!targetOrgId) {
      try {
        const getOrgRes = await fetch(orgUrl, { method: 'GET', headers });
        const orgData = await getOrgRes.json();
        const list = orgData?.data?.rows || orgData?.data?.responses || orgData?.data || (Array.isArray(orgData) ? orgData : []);
        if (Array.isArray(list) && list.length > 0 && list[0]?.id) {
          targetOrgId = list[0].id;
        } else {
          // Create default organization
          const createOrgRes = await fetch(orgUrl, {
            method: 'POST',
            headers,
            body: JSON.stringify({
              name: `${firstName}'s Hotel Group`,
              email: email,
              phone: phone || '0000000000',
              address: 'Main St',
            }),
          });
          const newOrg = await createOrgRes.json();
          targetOrgId = newOrg?.data?.id || newOrg?.id;
        }
      } catch (e) {
        console.warn('Auto organization resolution warning:', e);
      }
    }

    // Auto-fetch default role ID if not provided (to satisfy role_id NOT NULL constraint)
    let targetRoleId = (typeof roleId !== 'undefined' && roleId) ? roleId : null;
    if (!targetRoleId) {
      try {
        const roleUrl = `${apiBase}/role`;
        const getRoleRes = await fetch(roleUrl, { method: 'GET', headers });
        const roleData = await getRoleRes.json();
        const roleList = roleData?.data?.rows || roleData?.data?.responses || roleData?.data || (Array.isArray(roleData) ? roleData : []);
        if (Array.isArray(roleList) && roleList.length > 0 && roleList[0]?.id) {
          targetRoleId = roleList[0].id;
        }
      } catch (e) {
        console.warn('Auto role resolution warning:', e);
      }
    }

    const payload = {
      firstName,
      lastName,
      email,
      phoneNo: phone,
      password,
      status: 'active',
      ...(targetOrgId ? { organizationId: targetOrgId } : {}),
      ...(targetRoleId ? { roleId: targetRoleId } : {}),
    };

    const res = await fetch(userUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: err.message || 'Registration failed' };
  }
};

export const loginUser = async (email, password) => authService.login(email, password);

export default authService;
