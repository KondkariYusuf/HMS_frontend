/**
 * @file Admin/RBAC/Index.jsx
 * @description Production Role and Permission Management interface with Full RBAC capabilities.
 * Capabilities:
 * - Create Custom Role (linked with organizationId)
 * - Edit Role details (Name & Description via PUT /api/role/:id)
 * - Delete Custom Role
 * - Create New Permission (via POST /api/permission) and link to SubModule (via POST /api/module-permission)
 * - Modern search & submodule filter toolbar
 * - Configurable pagination with preserved category groupings
 * - Bulk select / deselect filtered permissions
 * - Granular permission assignment with atomic backend persistence
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Shield,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  X,
  RefreshCw,
  Edit3,
  Search,
  ChevronLeft,
  ChevronRight,
  Check,
  Filter,
  Key,
} from 'lucide-react';
import Button from '@components/Button/Button';
import { useAuth } from '@hooks/useAuth';
import permissionService from '@services/permissionService';
import modulePermissionService from '@services/modulePermissionService';
import subModuleService from '@services/subModuleService';
import organizationService from '@services/organizationService';
import styles from './Index.module.css';

const isUUID = (str) =>
  typeof str === 'string' &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

const getRoleInitials = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

const HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

// Fallback default permissions grouping in case backend DB is offline
const DEFAULT_FALLBACK_GROUPS = [
  {
    name: 'Hotel & Reservations',
    permissions: [
      { id: 'perm-view-res', code: 'BOOKING_READALL', name: 'View Reservations', description: 'Access reservation roster and calendar.' },
      { id: 'perm-manage-res', code: 'BOOKING_CREATE', name: 'Manage Reservations', description: 'Create, update, check-in, and cancel bookings.' },
      { id: 'perm-manage-rooms', code: 'ROOM_CREATE', name: 'Manage Rooms', description: 'Configure room types, rates, and occupancy.' },
      { id: 'perm-manage-guests', code: 'HOTEL_GUEST_CREATE', name: 'Manage Guests', description: 'View and edit guest profiles and ID proofs.' },
    ],
  },
  {
    name: 'Billing & Finance',
    permissions: [
      { id: 'perm-view-inv', code: 'INVOICE_READALL', name: 'View Invoices', description: 'Browse guest folios and financial invoices.' },
      { id: 'perm-manage-inv', code: 'INVOICE_CREATE', name: 'Manage Invoices', description: 'Issue, edit, and void invoices and folios.' },
      { id: 'perm-manage-pay', code: 'PAYMENT_CREATE', name: 'Manage Payments', description: 'Record payments, process refunds, and adjust balances.' },
    ],
  },
  {
    name: 'Administration & System',
    permissions: [
      { id: 'perm-manage-users', code: 'USER_CREATE', name: 'Manage Users', description: 'Invite staff members and manage accounts.' },
      { id: 'perm-manage-roles', code: 'ROLE_CREATE', name: 'Manage Roles', description: 'Configure role permissions and access control.' },
      { id: 'perm-manage-branches', code: 'BRANCH_CREATE', name: 'Manage Branches', description: 'Manage organization branches and settings.' },
    ],
  },
];

export default function AdminRBACPage() {
  const { user: currentUser } = useAuth();

  // Roles state from backend
  const [roles, setRoles] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [loadingRoles, setLoadingRoles] = useState(true);

  // Organizations list for role creation
  const [organizations, setOrganizations] = useState([]);

  // SubModules list for permission creation
  const [subModulesList, setSubModulesList] = useState([]);

  // Permissions state from backend
  const [permissionGroups, setPermissionGroups] = useState([]);
  const [loadingPermissions, setLoadingPermissions] = useState(true);

  // Role's assigned modulePermission IDs (Set of modulePermission UUIDs)
  const [assignedPermissionIds, setAssignedPermissionIds] = useState(new Set());
  const [initialAssignedIds, setInitialAssignedIds] = useState(new Set());
  const [loadingRolePermissions, setLoadingRolePermissions] = useState(false);

  // Save / Action feedback state
  const [isSaving, setIsSaving] = useState(false);
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  const [successToast, setSuccessToast] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Create Role Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDescription, setNewRoleDescription] = useState('');
  const [newRoleOrgId, setNewRoleOrgId] = useState('');
  const [isCreatingRole, setIsCreatingRole] = useState(false);

  // Edit Role Modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editRoleName, setEditRoleName] = useState('');
  const [editRoleDescription, setEditRoleDescription] = useState('');
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);

  // Delete Role Confirmation state
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [isDeletingRole, setIsDeletingRole] = useState(false);

  // Create Permission Modal state
  const [showCreatePermModal, setShowCreatePermModal] = useState(false);
  const [newPermName, setNewPermName] = useState('');
  const [newPermCode, setNewPermCode] = useState('');
  const [userEditedCode, setUserEditedCode] = useState(false);
  const [newPermMethod, setNewPermMethod] = useState('GET');
  const [newPermPath, setNewPermPath] = useState('');
  const [newPermSubModuleId, setNewPermSubModuleId] = useState('');
  const [newPermDescription, setNewPermDescription] = useState('');
  const [isCreatingPerm, setIsCreatingPerm] = useState(false);

  // Edit Permission Modal state
  const [showEditPermModal, setShowEditPermModal] = useState(false);
  const [editingPerm, setEditingPerm] = useState(null);
  const [editPermName, setEditPermName] = useState('');
  const [editPermCode, setEditPermCode] = useState('');
  const [editPermMethod, setEditPermMethod] = useState('GET');
  const [editPermPath, setEditPermPath] = useState('');
  const [editPermSubModuleId, setEditPermSubModuleId] = useState('');
  const [editPermDescription, setEditPermDescription] = useState('');
  const [isUpdatingPerm, setIsUpdatingPerm] = useState(false);

  // Delete Permission Confirmation state
  const [permToDelete, setPermToDelete] = useState(null);
  const [isDeletingPerm, setIsDeletingPerm] = useState(false);

  // Search & Filter & Pagination states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModuleFilter, setSelectedModuleFilter] = useState('all');
  const [permPage, setPermPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  // 1. Fetch available organizations (needed because backend requires organizationId for role creation)
  const fetchOrganizations = useCallback(async () => {
    try {
      const res = await organizationService.getAll({ fetchAll: 'true' });
      const list = res?.data?.responses || res?.data?.rows || (Array.isArray(res?.data) ? res.data : []);
      if (Array.isArray(list) && list.length > 0) {
        setOrganizations(list);
        const defaultOrg = currentUser?.organizationId || localStorage.getItem('syncstays_org_id') || list[0]?.id;
        if (defaultOrg && list.some((o) => o.id === defaultOrg)) {
          setNewRoleOrgId(defaultOrg);
        } else if (list[0]?.id) {
          setNewRoleOrgId(list[0].id);
        }
      }
    } catch (err) {
      console.warn('Failed to load organizations catalog:', err);
    }
  }, [currentUser]);

  // 2. Fetch available sub-modules (needed for creating and grouping permissions)
  const fetchSubModules = useCallback(async () => {
    try {
      const res = await subModuleService.getAll({ fetchAll: 'true', isActive: 'true' });
      const isOk = res && !res.error && (!res.statusCode || res.statusCode < 400);
      if (isOk) {
        const list = res?.data?.responses || res?.data?.rows || (Array.isArray(res?.data) ? res.data : []);
        if (Array.isArray(list) && list.length > 0) {
          setSubModulesList(list);
          setNewPermSubModuleId((prev) => prev || list[0].id);
        }
      }
    } catch (err) {
      console.warn('Failed to load sub-modules catalog:', err);
    }
  }, []);

  // 3. Fetch all roles from backend API
  const fetchRoles = useCallback(async () => {
    setLoadingRoles(true);
    setErrorMessage('');
    try {
      const res = await permissionService.getRoles({ fetchAll: 'true' });
      const isOk = res && !res.error && (!res.statusCode || res.statusCode < 400);
      if (isOk) {
        const list = res?.data?.responses || res?.data?.rows || (Array.isArray(res?.data) ? res.data : []);
        if (Array.isArray(list) && list.length > 0) {
          setRoles(list);
          setSelectedRoleId((current) => {
            if (current && list.some((r) => String(r.id) === String(current))) {
              return current;
            }
            return list[0].id;
          });
        } else {
          setRoles([]);
        }
      } else {
        setErrorMessage(res?.message || 'Could not fetch roles from server.');
      }
    } catch (err) {
      console.warn('Roles fetch error:', err);
      setErrorMessage('Failed to load roles from backend API.');
    } finally {
      setLoadingRoles(false);
    }
  }, []);

  // 4. Fetch system module-permissions catalog and group them
  const fetchPermissionsCatalog = useCallback(async () => {
    setLoadingPermissions(true);
    try {
      const mpRes = await modulePermissionService.getAll({ fetchAll: 'true' });
      let mpList = [];
      const isOk = mpRes && !mpRes.error && (!mpRes.statusCode || mpRes.statusCode < 400);
      if (isOk) {
        mpList = mpRes?.data?.responses || mpRes?.data?.rows || (Array.isArray(mpRes?.data) ? mpRes.data : []);
      }

      if (Array.isArray(mpList) && mpList.length > 0) {
        const groupsMap = new Map();
        mpList.forEach((mp) => {
          const groupName = mp.subModuleData?.name || 'General Operations';
          if (!groupsMap.has(groupName)) {
            groupsMap.set(groupName, []);
          }
          groupsMap.get(groupName).push({
            id: mp.id, // modulePermission.id required by backend
            permissionId: mp.permissionId,
            subModuleId: mp.subModuleId,
            code: mp.permissionData?.code || 'PERMISSION',
            name: mp.permissionData?.actionName || mp.permissionData?.code || 'Action',
            actionName: mp.permissionData?.actionName || '',
            method: mp.permissionData?.method || 'GET',
            baseUrl: mp.permissionData?.baseUrl || '/api',
            path: mp.permissionData?.path || '',
            description: mp.permissionData?.description || `${mp.permissionData?.method || ''} ${mp.permissionData?.path || ''}`,
          });
        });

        const formattedGroups = Array.from(groupsMap.entries()).map(([name, permissions]) => ({
          name,
          permissions,
        }));
        setPermissionGroups(formattedGroups);
      } else {
        const permRes = await permissionService.getPermissions({ fetchAll: 'true' });
        const permList = permRes?.data?.responses || permRes?.data?.rows || (Array.isArray(permRes?.data) ? permRes.data : []);

        if (Array.isArray(permList) && permList.length > 0) {
          const groupsMap = new Map();
          permList.forEach((p) => {
            const prefix = (p.code || '').split('_')[0] || 'GENERAL';
            const groupTitle = prefix.charAt(0) + prefix.slice(1).toLowerCase();
            if (!groupsMap.has(groupTitle)) {
              groupsMap.set(groupTitle, []);
            }
            groupsMap.get(groupTitle).push({
              id: p.id,
              permissionId: p.id,
              code: p.code,
              name: p.actionName || p.code,
              actionName: p.actionName || '',
              method: p.method || 'GET',
              baseUrl: p.baseUrl || '/api',
              path: p.path || '',
              description: p.description || `${p.method || ''} ${p.path || ''}`,
            });
          });

          setPermissionGroups(Array.from(groupsMap.entries()).map(([name, permissions]) => ({ name, permissions })));
        } else {
          setPermissionGroups(DEFAULT_FALLBACK_GROUPS);
        }
      }
    } catch (err) {
      console.warn('Permissions catalog fetch warning:', err);
      setPermissionGroups(DEFAULT_FALLBACK_GROUPS);
    } finally {
      setLoadingPermissions(false);
    }
  }, []);

  // 5. Fetch permissions assigned to selected role
  const fetchSelectedRolePermissions = useCallback(async (roleId) => {
    if (!roleId) return;
    // Protect against non-UUID strings to prevent PostgreSQL syntax error 22P02
    if (!isUUID(roleId)) {
      setAssignedPermissionIds(new Set());
      setInitialAssignedIds(new Set());
      return;
    }

    setLoadingRolePermissions(true);
    try {
      const res = await permissionService.getRolePermissions(roleId);
      const isOk = res && !res.error && (!res.statusCode || res.statusCode < 400);
      if (isOk) {
        const list = res?.data?.responses || res?.data?.rows || (Array.isArray(res?.data) ? res.data : []);
        if (Array.isArray(list)) {
          const ids = new Set();
          list.forEach((item) => {
            if (item.modulePermissionId) ids.add(item.modulePermissionId);
            else if (item.id) ids.add(item.id);
          });
          setAssignedPermissionIds(ids);
          setInitialAssignedIds(new Set(ids));
        }
      } else {
        setAssignedPermissionIds(new Set());
        setInitialAssignedIds(new Set());
      }
    } catch (err) {
      console.warn('Role permissions fetch warning:', err);
      setAssignedPermissionIds(new Set());
      setInitialAssignedIds(new Set());
    } finally {
      setLoadingRolePermissions(false);
    }
  }, []);

  // Initial mount load
  useEffect(() => {
    fetchRoles();
    fetchOrganizations();
    fetchSubModules();
    fetchPermissionsCatalog();
  }, [fetchRoles, fetchOrganizations, fetchSubModules, fetchPermissionsCatalog]);

  // When selected role changes, fetch its assigned permissions
  useEffect(() => {
    if (selectedRoleId) {
      fetchSelectedRolePermissions(selectedRoleId);
    }
  }, [selectedRoleId, fetchSelectedRolePermissions]);

  const selectedRole = useMemo(
    () => roles.find((r) => String(r.id) === String(selectedRoleId)) || roles[0] || null,
    [roles, selectedRoleId]
  );

  const isSuperAdminRole = useMemo(() => {
    if (!selectedRole) return false;
    const name = (selectedRole.name || '').toLowerCase();
    return name.includes('super admin') || name.includes('superadmin');
  }, [selectedRole]);

  // Flattened permission items enriched with group name
  const allFlatPermissions = useMemo(() => {
    const list = [];
    permissionGroups.forEach((g) => {
      (g.permissions || []).forEach((p) => {
        list.push({
          ...p,
          groupName: g.name,
        });
      });
    });
    return list;
  }, [permissionGroups]);

  // Total permissions count
  const allPermissionsCount = allFlatPermissions.length;

  // Module filter options with counts
  const moduleOptions = useMemo(() => {
    const map = new Map();
    allFlatPermissions.forEach((p) => {
      const current = map.get(p.groupName) || 0;
      map.set(p.groupName, current + 1);
    });
    return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
  }, [allFlatPermissions]);

  // Reset page when search or module filter changes
  useEffect(() => {
    setPermPage(1);
  }, [searchQuery, selectedModuleFilter, pageSize]);

  // Filtered permissions based on search query and module selection
  const filteredPermissions = useMemo(() => {
    let result = allFlatPermissions;

    if (selectedModuleFilter !== 'all') {
      result = result.filter((p) => p.groupName === selectedModuleFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.code.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          p.groupName.toLowerCase().includes(q)
      );
    }

    return result;
  }, [allFlatPermissions, selectedModuleFilter, searchQuery]);

  // Pagination calculation
  const totalFiltered = filteredPermissions.length;
  const isPageSizeAll = pageSize === 'all';
  const effectivePageSize = isPageSizeAll ? Math.max(totalFiltered, 1) : Number(pageSize);
  const totalPages = Math.max(1, Math.ceil(totalFiltered / effectivePageSize));
  const currentPage = Math.min(Math.max(1, permPage), totalPages);

  const paginatedPermissions = useMemo(() => {
    if (isPageSizeAll) return filteredPermissions;
    const start = (currentPage - 1) * effectivePageSize;
    return filteredPermissions.slice(start, start + effectivePageSize);
  }, [filteredPermissions, currentPage, effectivePageSize, isPageSizeAll]);

  // Group paginated items by module name so visual category cards remain intact
  const paginatedGroups = useMemo(() => {
    const groupsMap = new Map();
    paginatedPermissions.forEach((p) => {
      if (!groupsMap.has(p.groupName)) {
        groupsMap.set(p.groupName, []);
      }
      groupsMap.get(p.groupName).push(p);
    });
    return Array.from(groupsMap.entries()).map(([name, permissions]) => ({
      name,
      permissions,
    }));
  }, [paginatedPermissions]);

  // Count assigned active permissions
  const activeAssignedCount = useMemo(() => {
    if (isSuperAdminRole) return allPermissionsCount;
    let count = 0;
    allFlatPermissions.forEach((p) => {
      if (assignedPermissionIds.has(p.id)) {
        count += 1;
      }
    });
    return count;
  }, [isSuperAdminRole, allPermissionsCount, allFlatPermissions, assignedPermissionIds]);

  // Detect unsaved changes
  const hasUnsavedChanges = useMemo(() => {
    if (isSuperAdminRole) return false;
    if (assignedPermissionIds.size !== initialAssignedIds.size) return true;
    for (const id of assignedPermissionIds) {
      if (!initialAssignedIds.has(id)) return true;
    }
    return false;
  }, [assignedPermissionIds, initialAssignedIds, isSuperAdminRole]);

  // Toggle single permission for selected role
  const togglePermission = (perm) => {
    if (!selectedRole || isSuperAdminRole) return;
    setShowSavedMessage(false);

    setAssignedPermissionIds((prev) => {
      const next = new Set(prev);
      if (next.has(perm.id)) {
        next.delete(perm.id);
      } else {
        next.add(perm.id);
      }
      return next;
    });
  };

  const isPermissionEnabled = (perm) => {
    if (isSuperAdminRole) return true;
    return assignedPermissionIds.has(perm.id);
  };

  // Quick Select / Deselect all currently filtered permissions
  const handleSelectAllFiltered = () => {
    if (!selectedRole || isSuperAdminRole) return;
    setShowSavedMessage(false);
    setAssignedPermissionIds((prev) => {
      const next = new Set(prev);
      filteredPermissions.forEach((p) => {
        if (p.id) next.add(p.id);
      });
      return next;
    });
  };

  const handleDeselectAllFiltered = () => {
    if (!selectedRole || isSuperAdminRole) return;
    setShowSavedMessage(false);
    setAssignedPermissionIds((prev) => {
      const next = new Set(prev);
      filteredPermissions.forEach((p) => {
        if (p.id) next.delete(p.id);
      });
      return next;
    });
  };

  // Save changes via backend POST /api/role-permission or DELETE /api/role-permission/:id
  const handleSaveChanges = async () => {
    if (!selectedRole || !hasUnsavedChanges || isSaving) return;

    setIsSaving(true);
    setErrorMessage('');
    setShowSavedMessage(false);

    try {
      const modulePermissionIds = Array.from(assignedPermissionIds).filter(isUUID);
      const res = await permissionService.bulkAssignRolePermissions(selectedRole.id, modulePermissionIds);
      const isOk = res && !res.error && (!res.statusCode || res.statusCode < 400);

      if (isOk) {
        setInitialAssignedIds(new Set(assignedPermissionIds));
        setShowSavedMessage(true);
        setTimeout(() => setShowSavedMessage(false), 3500);
      } else {
        setErrorMessage(res?.message || 'Failed to save role permissions.');
      }
    } catch (err) {
      console.error('Error saving role permissions:', err);
      setErrorMessage(err.message || 'Network error saving role permissions.');
    } finally {
      setIsSaving(false);
    }
  };

  // Create custom role via POST /api/role (sending required organizationId UUID)
  const handleCreateRole = async (e) => {
    e.preventDefault();
    const name = newRoleName.trim();
    if (!name || isCreatingRole) return;

    const orgId =
      newRoleOrgId ||
      currentUser?.organizationId ||
      localStorage.getItem('syncstays_org_id') ||
      (roles.find((r) => r.organizationId)?.organizationId) ||
      (organizations[0]?.id);

    if (!orgId || !isUUID(orgId)) {
      setErrorMessage('A valid Organization is required to create a role. Please select an organization.');
      return;
    }

    setIsCreatingRole(true);
    setErrorMessage('');

    try {
      const payload = {
        name,
        description: newRoleDescription.trim() || undefined,
        organizationId: orgId,
      };

      const res = await permissionService.createRole(payload);
      const isOk = res && !res.error && (!res.statusCode || res.statusCode < 400);

      if (isOk) {
        const createdRole = res?.data?.role || res?.data?.responses || res?.data;
        await fetchRoles();
        if (createdRole?.id && isUUID(createdRole.id)) {
          setSelectedRoleId(createdRole.id);
        }
        setShowCreateModal(false);
        setNewRoleName('');
        setNewRoleDescription('');
        setSuccessToast(`Role "${name}" created successfully!`);
        setTimeout(() => setSuccessToast(''), 4000);
      } else {
        setErrorMessage(res?.message || 'Failed to create role.');
      }
    } catch (err) {
      console.error('Error creating role:', err);
      setErrorMessage(err.message || 'Error creating role.');
    } finally {
      setIsCreatingRole(false);
    }
  };

  // Open Edit Role modal
  const openEditModal = (role) => {
    if (!role) return;
    setEditRoleName(role.name || '');
    setEditRoleDescription(role.description || '');
    setShowEditModal(true);
  };

  // Update role via PUT /api/role/:id
  const handleUpdateRole = async (e) => {
    e.preventDefault();
    const name = editRoleName.trim();
    if (!name || isUpdatingRole || !selectedRole) return;

    setIsUpdatingRole(true);
    setErrorMessage('');

    try {
      const payload = {
        name,
        description: editRoleDescription.trim() || undefined,
      };

      const res = await permissionService.updateRole(selectedRole.id, payload);
      const isOk = res && !res.error && (!res.statusCode || res.statusCode < 400);

      if (isOk) {
        setRoles((prev) =>
          prev.map((r) =>
            r.id === selectedRole.id
              ? { ...r, name, description: editRoleDescription.trim() }
              : r
          )
        );
        setShowEditModal(false);
        await fetchRoles();
        setSuccessToast(`Role "${name}" updated successfully!`);
        setTimeout(() => setSuccessToast(''), 4000);
      } else {
        setErrorMessage(res?.message || 'Failed to update role.');
      }
    } catch (err) {
      console.error('Error updating role:', err);
      setErrorMessage(err.message || 'Error updating role.');
    } finally {
      setIsUpdatingRole(false);
    }
  };

  // Delete role via DELETE /api/role/:id
  const handleDeleteRole = async () => {
    if (!roleToDelete || isDeletingRole) return;

    setIsDeletingRole(true);
    setErrorMessage('');

    try {
      const res = await permissionService.deleteRole(roleToDelete.id);
      const isOk = res && !res.error && (!res.statusCode || res.statusCode < 400);

      if (isOk) {
        setRoleToDelete(null);
        await fetchRoles();
        setSuccessToast(`Role "${roleToDelete.name}" deleted.`);
        setTimeout(() => setSuccessToast(''), 4000);
      } else {
        setErrorMessage(res?.message || 'Failed to delete role.');
      }
    } catch (err) {
      console.error('Error deleting role:', err);
      setErrorMessage(err.message || 'Error deleting role.');
    } finally {
      setIsDeletingRole(false);
    }
  };

  // Handle permission name input and auto-generate code
  const handlePermNameChange = (val) => {
    setNewPermName(val);
    if (!userEditedCode) {
      const generated = val
        .trim()
        .toUpperCase()
        .replace(/[^A-Z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');
      setNewPermCode(generated);
    }
  };

  // Create Permission and link to SubModule
  const handleCreatePermission = async (e) => {
    e.preventDefault();
    const code = newPermCode.trim().toUpperCase();
    const actionName = newPermName.trim();
    if (!code || !newPermSubModuleId || isCreatingPerm) return;

    setIsCreatingPerm(true);
    setErrorMessage('');

    try {
      // 1. Create permission in /api/permission
      const defaultPath = newPermPath.trim()
        ? (newPermPath.startsWith('/') ? newPermPath.trim() : `/${newPermPath.trim()}`)
        : `/${code.toLowerCase().replace(/_/g, '-')}`;

      const permPayload = {
        code,
        actionName: actionName || code,
        method: newPermMethod || 'GET',
        baseUrl: '/api',
        path: defaultPath,
        description: newPermDescription.trim() || `Allows ${actionName || code}`,
      };

      const permRes = await permissionService.createPermission(permPayload);
      const isPermOk = permRes && !permRes.error && (!permRes.statusCode || permRes.statusCode < 400);

      if (!isPermOk) {
        setErrorMessage(permRes?.message || 'Failed to create permission.');
        setIsCreatingPerm(false);
        return;
      }

      const createdPerm = permRes?.data?.permission || permRes?.data?.responses || permRes?.data;
      const createdPermId = createdPerm?.id;

      // 2. Link permission to selected subModule in /api/module-permission
      if (createdPermId && newPermSubModuleId) {
        // Fetch existing permissions for this subModule so they are not wiped
        const existingMpRes = await modulePermissionService.getAll({ subModuleId: newPermSubModuleId, fetchAll: 'true' });
        const existingList = existingMpRes?.data?.responses || existingMpRes?.data?.rows || (Array.isArray(existingMpRes?.data) ? existingMpRes.data : []);
        const existingPermIds = existingList.map((mp) => mp.permissionId).filter(Boolean);
        const combinedPermIds = [...new Set([...existingPermIds, createdPermId])];

        await modulePermissionService.create({
          subModuleId: newPermSubModuleId,
          permissionIds: combinedPermIds,
        });
      }

      // 3. Refresh permissions catalog so the new permission shows up immediately
      await fetchPermissionsCatalog();

      setShowCreatePermModal(false);
      setNewPermName('');
      setNewPermCode('');
      setUserEditedCode(false);
      setNewPermMethod('GET');
      setNewPermPath('');
      setNewPermDescription('');
      setSuccessToast(`Permission "${actionName || code}" created and linked to module!`);
      setTimeout(() => setSuccessToast(''), 4500);
    } catch (err) {
      console.error('Error creating permission:', err);
      setErrorMessage(err.message || 'Error creating permission.');
    } finally {
      setIsCreatingPerm(false);
    }
  };

  // Open Edit Permission modal
  const openEditPermModal = (perm) => {
    if (!perm) return;
    setEditingPerm(perm);
    setEditPermName(perm.actionName || perm.name || '');
    setEditPermCode(perm.code || '');
    setEditPermMethod(perm.method || 'GET');
    setEditPermPath(perm.path || '');
    setEditPermSubModuleId(perm.subModuleId || (subModulesList[0]?.id || ''));
    setEditPermDescription(perm.description || '');
    setShowEditPermModal(true);
  };

  // Update Permission via PUT /api/permission/:id
  const handleUpdatePermission = async (e) => {
    e.preventDefault();
    if (!editingPerm || isUpdatingPerm) return;

    const targetPermId = editingPerm.permissionId || editingPerm.id;
    if (!targetPermId || !isUUID(targetPermId)) {
      setErrorMessage('Cannot update permission: invalid or fallback ID.');
      return;
    }

    const code = editPermCode.trim().toUpperCase();
    const actionName = editPermName.trim();
    if (!code) {
      setErrorMessage('Permission code is required.');
      return;
    }

    setIsUpdatingPerm(true);
    setErrorMessage('');

    try {
      const updatePayload = {
        code,
        actionName: actionName || code,
        method: editPermMethod || 'GET',
        baseUrl: editingPerm.baseUrl || '/api',
        path: editPermPath.trim() || undefined,
        description: editPermDescription.trim() || undefined,
      };

      const res = await permissionService.updatePermission(targetPermId, updatePayload);
      const isOk = res && !res.error && (!res.statusCode || res.statusCode < 400);

      if (!isOk) {
        setErrorMessage(res?.message || 'Failed to update permission.');
        setIsUpdatingPerm(false);
        return;
      }

      // If subModuleId changed, update module permission linkage
      if (editPermSubModuleId && editingPerm.subModuleId && editPermSubModuleId !== editingPerm.subModuleId) {
        // 1. Remove from old subModule
        const oldMpRes = await modulePermissionService.getAll({ subModuleId: editingPerm.subModuleId, fetchAll: 'true' });
        const oldList = oldMpRes?.data?.responses || oldMpRes?.data?.rows || (Array.isArray(oldMpRes?.data) ? oldMpRes.data : []);
        const filteredOldPermIds = oldList.map((mp) => mp.permissionId).filter((pId) => pId !== targetPermId);
        await modulePermissionService.create({
          subModuleId: editingPerm.subModuleId,
          permissionIds: filteredOldPermIds,
        });

        // 2. Add to new subModule
        const newMpRes = await modulePermissionService.getAll({ subModuleId: editPermSubModuleId, fetchAll: 'true' });
        const newList = newMpRes?.data?.responses || newMpRes?.data?.rows || (Array.isArray(newMpRes?.data) ? newMpRes.data : []);
        const combinedNewPermIds = [...new Set([...newList.map((mp) => mp.permissionId).filter(Boolean), targetPermId])];
        await modulePermissionService.create({
          subModuleId: editPermSubModuleId,
          permissionIds: combinedNewPermIds,
        });
      }

      await fetchPermissionsCatalog();
      setShowEditPermModal(false);
      setEditingPerm(null);
      setSuccessToast(`Permission "${actionName || code}" updated successfully!`);
      setTimeout(() => setSuccessToast(''), 4000);
    } catch (err) {
      console.error('Error updating permission:', err);
      setErrorMessage(err.message || 'Error updating permission.');
    } finally {
      setIsUpdatingPerm(false);
    }
  };

  // Delete Permission via DELETE /api/permission/:id
  const handleDeletePermission = async () => {
    if (!permToDelete || isDeletingPerm) return;

    const targetPermId = permToDelete.permissionId || permToDelete.id;
    const targetModulePermId = permToDelete.id;

    setIsDeletingPerm(true);
    setErrorMessage('');

    try {
      let isOk = false;
      let errMsg = '';

      if (targetPermId && isUUID(targetPermId)) {
        const res = await permissionService.deletePermission(targetPermId);
        isOk = res && !res.error && (!res.statusCode || res.statusCode < 400);
        errMsg = res?.message;
      }

      // If delete by permission ID failed or if it was only a modulePermission
      if (!isOk && targetModulePermId && isUUID(targetModulePermId)) {
        const mpRes = await modulePermissionService.delete(targetModulePermId);
        isOk = mpRes && !mpRes.error && (!mpRes.statusCode || mpRes.statusCode < 400);
        if (!errMsg) errMsg = mpRes?.message;
      }

      if (isOk) {
        if (targetModulePermId) {
          setAssignedPermissionIds((prev) => {
            const next = new Set(prev);
            next.delete(targetModulePermId);
            return next;
          });
          setInitialAssignedIds((prev) => {
            const next = new Set(prev);
            next.delete(targetModulePermId);
            return next;
          });
        }
        await fetchPermissionsCatalog();
        setSuccessToast(`Permission "${permToDelete.name || permToDelete.code}" deleted.`);
        setTimeout(() => setSuccessToast(''), 4000);
        setPermToDelete(null);
      } else {
        setErrorMessage(errMsg || 'Failed to delete permission.');
      }
    } catch (err) {
      console.error('Error deleting permission:', err);
      setErrorMessage(err.message || 'Error deleting permission.');
    } finally {
      setIsDeletingPerm(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* Page Header */}
      <header className={styles.header}>
        <div>
          <div className={styles.eyebrow}>ADMINISTRATION</div>
          <h1 className={styles.title}>Roles & Permissions</h1>
          <p className={styles.subtitle}>
            Control what each staff role can access across SyncStays PMS modules.
          </p>
        </div>

        <div className={styles.headerActions}>
          <Button
            variant="outline"
            onClick={() => setShowCreatePermModal(true)}
            className={styles.headerOutlineBtn}
          >
            <Key size={15} style={{ marginRight: '6px' }} />
            Create Permission
          </Button>

          <Button variant="primary" onClick={() => setShowCreateModal(true)}>
            <Plus size={16} style={{ marginRight: '6px' }} />
            Create Custom Role
          </Button>
        </div>
      </header>

      {/* Global Error Banner */}
      {errorMessage && (
        <div className={styles.errorBanner}>
          <AlertTriangle size={16} />
          <span>{errorMessage}</span>
          <button
            type="button"
            onClick={() => setErrorMessage('')}
            className={styles.errorCloseBtn}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Success Banner */}
      {successToast && (
        <div className={styles.successBanner}>
          <CheckCircle2 size={16} />
          <span>{successToast}</span>
          <button
            type="button"
            onClick={() => setSuccessToast('')}
            className={styles.successCloseBtn}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Main Two-Column Layout */}
      <div className={styles.layout}>
        {/* Roles Sidebar */}
        <aside className={styles.rolesPanel}>
          <div className={styles.panelHeader}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2>Configured Roles</h2>
                <span>{roles.length} roles available</span>
              </div>
              <button
                type="button"
                onClick={fetchRoles}
                title="Refresh Roles"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)' }}
              >
                <RefreshCw size={14} className={loadingRoles ? styles.spin : ''} />
              </button>
            </div>
          </div>

          <div className={styles.roleList}>
            {roles.map((role) => {
              const isSelected = String(role.id) === String(selectedRoleId);
              const isSuper = (role.name || '').toLowerCase().includes('super admin');

              return (
                <div
                  key={role.id}
                  style={{ display: 'flex', alignItems: 'center', position: 'relative' }}
                >
                  <button
                    type="button"
                    className={`${styles.roleCard} ${isSelected ? styles.selectedRole : ''}`}
                    onClick={() => setSelectedRoleId(role.id)}
                  >
                    <div className={styles.roleIcon}>{getRoleInitials(role.name)}</div>
                    <div className={styles.roleInfo}>
                      <strong>{role.name}</strong>
                      <span>{role.description ? `${role.description.slice(0, 30)}...` : 'System Role'}</span>
                    </div>
                    <span className={styles.roleArrow}>›</span>
                  </button>

                  {!isSuper && isSelected && (
                    <div className={styles.cardQuickActions}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(role);
                        }}
                        title={`Edit ${role.name}`}
                        className={styles.cardActionBtn}
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setRoleToDelete(role);
                        }}
                        title={`Delete ${role.name}`}
                        className={`${styles.cardActionBtn} ${styles.deleteActionBtn}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}

            {roles.length === 0 && !loadingRoles && (
              <div className={styles.emptyRoles}>No roles configured yet.</div>
            )}
          </div>
        </aside>

        {/* Permissions Configuration Matrix */}
        {selectedRole && (
          <section className={styles.permissionsPanel}>
            {/* Selected Role Header */}
            <div className={styles.permissionHeader}>
              <div className={styles.headerLeft}>
                <div className={styles.roleEyebrow}>SELECTED ROLE</div>
                <div className={styles.roleTitleRow}>
                  <h2 className={styles.roleTitle}>{selectedRole.name}</h2>
                  {!isSuperAdminRole && (
                    <button
                      type="button"
                      onClick={() => openEditModal(selectedRole)}
                      className={styles.editRoleBtn}
                      title="Edit role name & description"
                    >
                      <Edit3 size={13} />
                      <span>Edit Details</span>
                    </button>
                  )}
                </div>
                {selectedRole.description && (
                  <p className={styles.roleDesc}>{selectedRole.description}</p>
                )}
              </div>

              <div className={styles.permissionSummary}>
                <strong>{activeAssignedCount}</strong>
                <span>Active Permissions</span>
              </div>
            </div>

            {isSuperAdminRole && (
              <div className={styles.fullAccessBanner}>
                <strong>Full Unrestricted Access</strong>
                <span>
                  The Super Admin role holds universal bypass privileges across all PMS controllers and modules.
                </span>
              </div>
            )}

            {/* Modern Permissions Toolbar: Search, Module Filter & Quick Actions */}
            <div className={styles.permToolbar}>
              {/* Left: Modern Search Box */}
              <div className={styles.searchContainer}>
                <Search size={15} className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search permissions by name, code, description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className={styles.clearSearchBtn}
                    title="Clear search"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Right: Module Filter & Quick Action Buttons */}
              <div className={styles.toolbarControls}>
                {/* Module Filter Select */}
                <div className={styles.filterWrapper}>
                  <Filter size={14} className={styles.filterIcon} />
                  <select
                    value={selectedModuleFilter}
                    onChange={(e) => setSelectedModuleFilter(e.target.value)}
                    className={styles.moduleSelect}
                  >
                    <option value="all">All Modules ({allFlatPermissions.length})</option>
                    {moduleOptions.map((opt) => (
                      <option key={opt.name} value={opt.name}>
                        {opt.name} ({opt.count})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Bulk Actions */}
                {!isSuperAdminRole && (
                  <div className={styles.bulkActionButtons}>
                    <button
                      type="button"
                      className={styles.quickSelectBtn}
                      onClick={handleSelectAllFiltered}
                      title="Grant all permissions currently filtered"
                    >
                      <Check size={13} />
                      <span>Select All</span>
                    </button>
                    <button
                      type="button"
                      className={styles.quickDeselectBtn}
                      onClick={handleDeselectAllFiltered}
                      title="Revoke all permissions currently filtered"
                    >
                      <X size={13} />
                      <span>Deselect All</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Matrix of Groups (Paginated) */}
            <div className={styles.matrix}>
              {loadingPermissions || loadingRolePermissions ? (
                <div className={styles.loadingBox}>
                  <RefreshCw size={22} className={styles.spin} style={{ marginBottom: '8px' }} />
                  <div>Loading permissions catalog...</div>
                </div>
              ) : paginatedGroups.length === 0 ? (
                <div className={styles.noResultsBox}>
                  <p>No permissions found matching &ldquo;{searchQuery}&rdquo;.</p>
                  <Button variant="outline" size="sm" onClick={() => { setSearchQuery(''); setSelectedModuleFilter('all'); }}>
                    Clear Filters
                  </Button>
                </div>
              ) : (
                paginatedGroups.map((group) => {
                  const enabledCount = group.permissions.filter(isPermissionEnabled).length;

                  return (
                    <div className={styles.permissionGroup} key={group.name}>
                      <div className={styles.groupHeader}>
                        <span className={styles.groupName}>{group.name}</span>
                        <span className={styles.groupCountBadge}>
                          {enabledCount} / {group.permissions.length} active
                        </span>
                      </div>

                      {group.permissions.map((perm) => {
                        const enabled = isPermissionEnabled(perm);

                        return (
                          <div
                            key={perm.id}
                            className={`${styles.permissionRow} ${enabled ? styles.permissionRowEnabled : ''}`}
                            onClick={() => togglePermission(perm)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                togglePermission(perm);
                              }
                            }}
                          >
                            <div className={styles.permTextContainer}>
                              <div className={styles.permNameRow}>
                                <strong className={styles.permActionTitle}>{perm.name}</strong>
                                {perm.code && (
                                  <span className={styles.permCodeBadge}>{perm.code}</span>
                                )}
                              </div>
                              <span className={styles.permDesc}>
                                {perm.description || `Grant ${perm.code} capability.`}
                              </span>
                            </div>

                            <div className={styles.permControls} onClick={(e) => e.stopPropagation()}>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openEditPermModal(perm);
                                }}
                                title={`Edit ${perm.name}`}
                                className={styles.permActionBtn}
                              >
                                <Edit3 size={13} />
                              </button>

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPermToDelete(perm);
                                }}
                                title={`Delete ${perm.name}`}
                                className={`${styles.permActionBtn} ${styles.permDeleteBtn}`}
                              >
                                <Trash2 size={13} />
                              </button>

                              <button
                                type="button"
                                className={`${styles.toggle} ${enabled ? styles.toggleOn : ''}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  togglePermission(perm);
                                }}
                                disabled={isSuperAdminRole}
                                aria-label={`Toggle ${perm.name}`}
                              >
                                <span />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })
              )}
            </div>

            {/* Pagination Controls Bar */}
            {totalFiltered > 0 && (
              <div className={styles.paginationBar}>
                <div className={styles.pageInfo}>
                  Showing{' '}
                  <strong>
                    {isPageSizeAll ? 1 : (currentPage - 1) * effectivePageSize + 1}–
                    {Math.min(currentPage * effectivePageSize, totalFiltered)}
                  </strong>{' '}
                  of <strong>{totalFiltered}</strong> permissions
                  {selectedModuleFilter !== 'all' && (
                    <span className={styles.filteredBadge}>in {selectedModuleFilter}</span>
                  )}
                </div>

                <div className={styles.pageControls}>
                  <div className={styles.pageSizeWrapper}>
                    <span>Rows per page:</span>
                    <select
                      value={pageSize}
                      onChange={(e) => setPageSize(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                      className={styles.pageSizeSelect}
                    >
                      <option value={10}>10</option>
                      <option value={15}>15</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value="all">All</option>
                    </select>
                  </div>

                  {!isPageSizeAll && totalPages > 1 && (
                    <div className={styles.pageNav}>
                      <button
                        type="button"
                        onClick={() => setPermPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage <= 1}
                        className={styles.pageNavBtn}
                        title="Previous page"
                      >
                        <ChevronLeft size={16} />
                      </button>

                      <span className={styles.pageIndicator}>
                        Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
                      </span>

                      <button
                        type="button"
                        onClick={() => setPermPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage >= totalPages}
                        className={styles.pageNavBtn}
                        title="Next page"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Save Bar */}
            <div className={styles.saveBar}>
              <div className={styles.saveStatus}>
                {showSavedMessage ? (
                  <span className={styles.savedMessage}>
                    <CheckCircle2 size={16} style={{ display: 'inline', marginRight: '6px' }} />
                    Permissions saved successfully to server
                  </span>
                ) : hasUnsavedChanges ? (
                  <span className={styles.unsavedMessage}>
                    Unsaved permission changes detected
                  </span>
                ) : (
                  <span>Permissions are in sync with server</span>
                )}
              </div>

              <Button
                variant="primary"
                onClick={handleSaveChanges}
                disabled={!hasUnsavedChanges || isSaving || isSuperAdminRole}
              >
                {isSaving ? 'Saving Changes...' : 'Save Changes'}
              </Button>
            </div>
          </section>
        )}

        {!selectedRole && (
          <section className={styles.permissionsPanel}>
            <div className={styles.emptyRoles}>Select or create a role to configure permissions.</div>
          </section>
        )}
      </div>

      {/* Create Custom Role Modal */}
      {showCreateModal && (
        <div className={styles.modalOverlay} onMouseDown={() => setShowCreateModal(false)}>
          <form
            className={styles.modal}
            onSubmit={handleCreateRole}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <h2>Create Custom Role</h2>
            <p>Define a new organizational role to assign granular module permissions.</p>

            {organizations.length > 0 && (
              <label style={{ marginBottom: '14px', display: 'block' }}>
                Organization *
                <select
                  value={newRoleOrgId}
                  onChange={(e) => setNewRoleOrgId(e.target.value)}
                  className={styles.modalSelect}
                  required
                >
                  {organizations.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.name || org.legalName || org.id}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <label>
              Role Name *
              <input
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                placeholder="e.g., Night Auditor, Lead Concierge"
                autoFocus
                required
              />
            </label>

            <label style={{ marginTop: '14px', display: 'block' }}>
              Description
              <input
                value={newRoleDescription}
                onChange={(e) => setNewRoleDescription(e.target.value)}
                placeholder="Brief summary of duties and responsibilities"
              />
            </label>

            <div className={styles.modalActions}>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                disabled={isCreatingRole}
              >
                Cancel
              </button>
              <Button variant="primary" type="submit" disabled={!newRoleName.trim() || isCreatingRole}>
                {isCreatingRole ? 'Creating...' : 'Create Role'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Role Modal */}
      {showEditModal && selectedRole && (
        <div className={styles.modalOverlay} onMouseDown={() => setShowEditModal(false)}>
          <form
            className={styles.modal}
            onSubmit={handleUpdateRole}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <h2>Edit Role Details</h2>
            <p>Modify the name and description for this organizational role.</p>

            <label>
              Role Name *
              <input
                value={editRoleName}
                onChange={(e) => setEditRoleName(e.target.value)}
                placeholder="e.g., Front Desk Supervisor"
                autoFocus
                required
              />
            </label>

            <label style={{ marginTop: '14px', display: 'block' }}>
              Description
              <input
                value={editRoleDescription}
                onChange={(e) => setEditRoleDescription(e.target.value)}
                placeholder="Brief summary of duties and responsibilities"
              />
            </label>

            <div className={styles.modalActions}>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                disabled={isUpdatingRole}
              >
                Cancel
              </button>
              <Button variant="primary" type="submit" disabled={!editRoleName.trim() || isUpdatingRole}>
                {isUpdatingRole ? 'Updating...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Role Confirmation Modal */}
      {roleToDelete && (
        <div className={styles.modalOverlay} onMouseDown={() => setRoleToDelete(null)}>
          <div className={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
            <h2 style={{ color: '#dc2626' }}>Delete Role Confirmation</h2>
            <p>
              Are you sure you want to delete the role <strong>{roleToDelete.name}</strong>?
              This action removes all attached permissions permanently from the server.
            </p>

            <div className={styles.modalActions}>
              <button
                type="button"
                onClick={() => setRoleToDelete(null)}
                disabled={isDeletingRole}
              >
                Cancel
              </button>
              <Button
                variant="primary"
                onClick={handleDeleteRole}
                disabled={isDeletingRole}
                style={{ background: '#dc2626', borderColor: '#dc2626' }}
              >
                {isDeletingRole ? 'Deleting...' : 'Confirm Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Create Permission Modal */}
      {showCreatePermModal && (
        <div className={styles.modalOverlay} onMouseDown={() => setShowCreatePermModal(false)}>
          <form
            className={styles.modal}
            onSubmit={handleCreatePermission}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <h2>Create New Permission</h2>
            <p>Add a granular system permission and link it to a submodule.</p>

            <label>
              Action / Permission Name *
              <input
                value={newPermName}
                onChange={(e) => handlePermNameChange(e.target.value)}
                placeholder="e.g., View Night Audit, Export Occupancy"
                autoFocus
                required
              />
            </label>

            <label style={{ marginTop: '14px', display: 'block' }}>
              Permission Code *
              <input
                value={newPermCode}
                onChange={(e) => {
                  setUserEditedCode(true);
                  setNewPermCode(e.target.value.toUpperCase());
                }}
                placeholder="e.g., AUDIT_READALL, OCCUPANCY_EXPORT"
                required
              />
              <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)', marginTop: '2px', display: 'block' }}>
                Unique programmatic code in uppercase format.
              </span>
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '14px' }}>
              <label>
                HTTP Method *
                <select
                  value={newPermMethod}
                  onChange={(e) => setNewPermMethod(e.target.value)}
                  className={styles.modalSelect}
                >
                  {HTTP_METHODS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Sub-Module Group *
                <select
                  value={newPermSubModuleId}
                  onChange={(e) => setNewPermSubModuleId(e.target.value)}
                  className={styles.modalSelect}
                  required
                >
                  {subModulesList.map((sm) => (
                    <option key={sm.id} value={sm.id}>
                      {sm.name || sm.code || sm.id}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label style={{ marginTop: '14px', display: 'block' }}>
              API Route Path
              <input
                value={newPermPath}
                onChange={(e) => setNewPermPath(e.target.value)}
                placeholder="e.g., /api/audit/night or /occupancy"
              />
            </label>

            <label style={{ marginTop: '14px', display: 'block' }}>
              Description
              <input
                value={newPermDescription}
                onChange={(e) => setNewPermDescription(e.target.value)}
                placeholder="Explain what access this capability grants"
              />
            </label>

            <div className={styles.modalActions}>
              <button
                type="button"
                onClick={() => setShowCreatePermModal(false)}
                disabled={isCreatingPerm}
              >
                Cancel
              </button>
              <Button
                variant="primary"
                type="submit"
                disabled={!newPermName.trim() || !newPermCode.trim() || !newPermSubModuleId || isCreatingPerm}
              >
                {isCreatingPerm ? 'Creating Permission...' : 'Create Permission'}
              </Button>
            </div>
          </form>
        </div>
      )}
      {/* Edit Permission Modal */}
      {showEditPermModal && editingPerm && (
        <div className={styles.modalOverlay} onMouseDown={() => setShowEditPermModal(false)}>
          <form
            className={styles.modal}
            onSubmit={handleUpdatePermission}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <h2>Edit Permission</h2>
            <p>Update permission details, HTTP method, path, or submodule classification.</p>

            <label>
              Action / Permission Name *
              <input
                value={editPermName}
                onChange={(e) => setEditPermName(e.target.value)}
                placeholder="e.g., View Night Audit"
                autoFocus
                required
              />
            </label>

            <label style={{ marginTop: '14px', display: 'block' }}>
              Permission Code *
              <input
                value={editPermCode}
                onChange={(e) => setEditPermCode(e.target.value.toUpperCase())}
                placeholder="e.g., AUDIT_READALL"
                required
              />
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '14px' }}>
              <label>
                HTTP Method *
                <select
                  value={editPermMethod}
                  onChange={(e) => setEditPermMethod(e.target.value)}
                  className={styles.modalSelect}
                >
                  {HTTP_METHODS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Sub-Module Group *
                <select
                  value={editPermSubModuleId}
                  onChange={(e) => setEditPermSubModuleId(e.target.value)}
                  className={styles.modalSelect}
                  required
                >
                  {subModulesList.map((sm) => (
                    <option key={sm.id} value={sm.id}>
                      {sm.name || sm.code || sm.id}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label style={{ marginTop: '14px', display: 'block' }}>
              API Route Path
              <input
                value={editPermPath}
                onChange={(e) => setEditPermPath(e.target.value)}
                placeholder="e.g., /api/audit/night"
              />
            </label>

            <label style={{ marginTop: '14px', display: 'block' }}>
              Description
              <input
                value={editPermDescription}
                onChange={(e) => setEditPermDescription(e.target.value)}
                placeholder="Explain what access this capability grants"
              />
            </label>

            <div className={styles.modalActions}>
              <button
                type="button"
                onClick={() => setShowEditPermModal(false)}
                disabled={isUpdatingPerm}
              >
                Cancel
              </button>
              <Button
                variant="primary"
                type="submit"
                disabled={!editPermName.trim() || !editPermCode.trim() || isUpdatingPerm}
              >
                {isUpdatingPerm ? 'Updating...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Permission Confirmation Modal */}
      {permToDelete && (
        <div className={styles.modalOverlay} onMouseDown={() => setPermToDelete(null)}>
          <div className={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
            <h2 style={{ color: '#dc2626' }}>Delete Permission Confirmation</h2>
            <p>
              Are you sure you want to delete permission <strong>{permToDelete.name}</strong> ({permToDelete.code})?
              This action removes the permission permanently from all roles, submodules, and the database.
            </p>

            <div className={styles.modalActions}>
              <button
                type="button"
                onClick={() => setPermToDelete(null)}
                disabled={isDeletingPerm}
              >
                Cancel
              </button>
              <Button
                variant="primary"
                onClick={handleDeletePermission}
                disabled={isDeletingPerm}
                style={{ background: '#dc2626', borderColor: '#dc2626' }}
              >
                {isDeletingPerm ? 'Deleting...' : 'Confirm Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}