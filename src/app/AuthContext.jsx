/**
 * @file AuthContext.jsx
 * @description Frontend authentication and active branch state for SyncStays.
 * Uses local React state/localStorage only. Backend integration can replace
 * the local persistence without changing the consuming components.
 */

import React, {
  createContext,
  useContext,
  useState,
} from 'react';

const AuthContext = createContext(null);

const USER_STORAGE_KEY = 'syncstays_user';
const TOKEN_STORAGE_KEY = 'syncstays_token';
const BRANCHES_STORAGE_KEY = 'syncstays_branches';
const ACTIVE_BRANCH_STORAGE_KEY = 'syncstays_branch_id';

const readStorage = (key, fallback = null) => {
  try {
    const value = localStorage.getItem(key);

    if (!value) {
      return fallback;
    }

    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const readStringStorage = (key) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const persistJson = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage failures.
  }
};

const persistString = (key, value) => {
  try {
    if (value) {
      localStorage.setItem(key, value);
    } else {
      localStorage.removeItem(key);
    }
  } catch {
    // Ignore storage failures.
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() =>
    readStorage(USER_STORAGE_KEY)
  );

  const [token, setToken] = useState(() =>
    readStringStorage(TOKEN_STORAGE_KEY)
  );

  const [branches, setBranches] = useState(() =>
    readStorage(BRANCHES_STORAGE_KEY, [])
  );

  const [activeBranchId, setActiveBranchId] = useState(() =>
    readStringStorage(ACTIVE_BRANCH_STORAGE_KEY)
  );

  const persistBranches = (nextBranches) => {
    setBranches(nextBranches);
    persistJson(BRANCHES_STORAGE_KEY, nextBranches);
  };

  const changeBranch = (branchId) => {
    const branchExists = branches.some(
      (branch) => branch.id === branchId
    );

    if (!branchExists) {
      return;
    }

    setActiveBranchId(branchId);
    persistString(
      ACTIVE_BRANCH_STORAGE_KEY,
      branchId
    );
  };

  const addBranch = (branchData) => {
    const newBranch = {
      id: `branch-${Date.now()}`,
      name: branchData.name.trim(),
      code: branchData.code.trim().toUpperCase(),
      location: branchData.location.trim(),
      manager: branchData.manager?.trim() || 'Unassigned',
      rooms: Number(branchData.rooms) || 0,
      staff: Number(branchData.staff) || 0,
      occupancy: Number(branchData.occupancy) || 0,
      status: branchData.status || 'Active',
    };

    const nextBranches = [
      ...branches,
      newBranch,
    ];

    persistBranches(nextBranches);

    if (!activeBranchId) {
      setActiveBranchId(newBranch.id);
      persistString(
        ACTIVE_BRANCH_STORAGE_KEY,
        newBranch.id
      );
    }

    return newBranch;
  };

  const updateBranch = (branchId, branchData) => {
    const nextBranches = branches.map((branch) => {
      if (branch.id !== branchId) {
        return branch;
      }

      return {
        ...branch,
        name: branchData.name.trim(),
        code: branchData.code.trim().toUpperCase(),
        location: branchData.location.trim(),
        manager:
          branchData.manager?.trim() || 'Unassigned',
        rooms:
          Number(branchData.rooms) || 0,
      };
    });

    persistBranches(nextBranches);
  };

  const toggleBranch = (branchId) => {
    const nextBranches = branches.map((branch) => {
      if (branch.id !== branchId) {
        return branch;
      }

      return {
        ...branch,
        status:
          branch.status === 'Active'
            ? 'Inactive'
            : 'Active',
      };
    });

    persistBranches(nextBranches);

    const targetBranch = nextBranches.find(
      (branch) => branch.id === branchId
    );

    if (
      targetBranch?.status === 'Inactive' &&
      activeBranchId === branchId
    ) {
      const fallback = nextBranches.find(
        (branch) => branch.status === 'Active'
      );

      if (fallback) {
        changeBranch(fallback.id);
      } else {
        setActiveBranchId(null);
        persistString(
          ACTIVE_BRANCH_STORAGE_KEY,
          null
        );
      }
    }
  };

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);

    persistJson(
      USER_STORAGE_KEY,
      userData
    );

    persistString(
      TOKEN_STORAGE_KEY,
      authToken
    );
  };

  const logout = () => {
    setUser(null);
    setToken(null);

    persistString(USER_STORAGE_KEY, null);
    persistString(TOKEN_STORAGE_KEY, null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,

        branches,
        activeBranchId,

        changeBranch,
        addBranch,
        updateBranch,
        toggleBranch,

        login,
        logout,

        isAuthenticated: Boolean(user && token),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used within an AuthProvider'
    );
  }

  return context;
}

export default AuthContext;