/**
 * @file AuthContext.jsx
 * @description Frontend authentication and active branch state for SyncStays.
 * Uses local React state/localStorage only. Backend integration can replace
 * the local persistence without changing the consuming components.
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { branchService } from '@services/branchService';

const AuthContext = createContext(null);

const USER_STORAGE_KEY = 'syncstays_user';
const TOKEN_STORAGE_KEY = 'syncstays_token';
const BRANCHES_STORAGE_KEY = 'syncstays_branches';
const ACTIVE_BRANCH_STORAGE_KEY = 'syncstays_branch_id';

const DEFAULT_USER = {
  name: 'Anita Sharma',
  email: 'anita@grandhotel.com',
  role: 'Owner',
};

const DEFAULT_BRANCHES = [
  {
    id: 'br-c3d4',
    name: 'Grand Hotel - MG Road',
    code: 'MG-ROAD',
    location: 'MG Road',
    manager: 'Anita Sharma',
    rooms: 120,
    staff: 45,
    occupancy: 72,
    status: 'Active',
  },
  {
    id: 'br-9x8y',
    name: 'Grand Hotel - Whitefield',
    code: 'WHITEFIELD',
    location: 'Whitefield',
    manager: 'Rahul Mehta',
    rooms: 95,
    staff: 38,
    occupancy: 68,
    status: 'Active',
  },
];

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

const readStringStorage = (key, fallback = null) => {
  try {
    return localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
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
    readStorage(USER_STORAGE_KEY, DEFAULT_USER)
  );

  const [token, setToken] = useState(() =>
    readStringStorage(TOKEN_STORAGE_KEY, 'demo_token')
  );

  const [branches, setBranches] = useState(() =>
    readStorage(BRANCHES_STORAGE_KEY, DEFAULT_BRANCHES)
  );

  const [activeBranchId, setActiveBranchId] = useState(() =>
    readStringStorage(
      ACTIVE_BRANCH_STORAGE_KEY,
      DEFAULT_BRANCHES[0]?.id || null
    )
  );

  useEffect(() => {
    async function loadApiBranches() {
      try {
        const res = await branchService.getAll();
        const rawList = res?.data?.responses || res?.data?.rows || res?.data?.data || (Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []));
        
        if (Array.isArray(rawList) && rawList.length > 0) {
          const apiBranches = rawList.map((b) => ({
            id: b.id || b._id,
            name: b.branchName || b.name,
            code: b.code || `BR-${b.id}`,
            location: b.address || b.addressLine1 || b.location || 'Branch Location',
            manager: b.manager || 'Unassigned',
            rooms: b.rooms || 0,
            staff: b.staff || 0,
            occupancy: b.occupancy || 0,
            status: b.status === 'INACTIVE' ? 'Inactive' : 'Active',
          }));
          setBranches(apiBranches);
          persistJson(BRANCHES_STORAGE_KEY, apiBranches);
        }
      } catch (err) {
        console.warn('Branch API offline, using local branch state.', err);
      }
    }
    loadApiBranches();
  }, []);

  const persistBranches = (nextBranches) => {
    setBranches(nextBranches);
    persistJson(BRANCHES_STORAGE_KEY, nextBranches);
  };

  const changeBranch = (branchId) => {
    const branchExists = branches.some(
      (branch) =>
        branch.id === branchId &&
        branch.status === 'Active'
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
      name: branchData.name?.trim() || 'Unnamed Branch',
      code:
        branchData.code?.trim().toUpperCase() ||
        `BR-${Date.now()}`,
      location:
        branchData.location?.trim() || 'Not specified',
      manager:
        branchData.manager?.trim() || 'Unassigned',
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

    if (!activeBranchId && newBranch.status === 'Active') {
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
        name:
          branchData.name?.trim() || branch.name,
        code:
          branchData.code?.trim().toUpperCase() ||
          branch.code,
        location:
          branchData.location?.trim() ||
          branch.location,
        manager:
          branchData.manager?.trim() ||
          'Unassigned',
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
        setActiveBranchId(fallback.id);

        persistString(
          ACTIVE_BRANCH_STORAGE_KEY,
          fallback.id
        );
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

    persistString(
      USER_STORAGE_KEY,
      null
    );

    persistString(
      TOKEN_STORAGE_KEY,
      null
    );
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