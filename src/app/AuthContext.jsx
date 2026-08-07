/**
 * @file AuthContext.jsx
 * @description Authentication and Active Branch state context for SyncStays platform.
 * Manages active user profile, JWT token, and active branch context (x-branch-id).
 */
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState({
    name: 'Sarah Connor',
    email: 'sarah@grandhorizon.com',
    role: 'Front Desk Supervisor',
  });
  const [token, setToken] = useState(
    localStorage.getItem('syncstays_token') || 'demo_token'
  );
  const [branches] = useState([
    { id: 'branch-1', name: 'Grand Horizon Resort (Main)' },
    { id: 'branch-2', name: 'Grand Horizon Beach Suites' },
  ]);
  const [activeBranchId, setActiveBranchId] = useState(
    localStorage.getItem('syncstays_branch_id') || 'branch-1'
  );

  const changeBranch = (branchId) => {
    setActiveBranchId(branchId);
    localStorage.setItem('syncstays_branch_id', branchId);
  };

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('syncstays_token', authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('syncstays_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        branches,
        activeBranchId,
        changeBranch,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
