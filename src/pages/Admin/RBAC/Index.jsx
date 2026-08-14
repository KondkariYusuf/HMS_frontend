/**
 * @file Admin/RBAC/Index.jsx
 * @description Frontend role and permission management interface.
 */

import React, { useMemo, useState } from 'react';
import Button from '@components/Button/Button';
import { useAuth } from '@hooks/useAuth';
import styles from './Index.module.css';

const permissionGroups = [
  {
    name: 'Hotel',
    permissions: [
      'View Reservations',
      'Manage Reservations',
      'Manage Rooms',
      'Manage Guests',
    ],
  },
  {
    name: 'Restaurant',
    permissions: [
      'View POS',
      'Manage Orders',
      'Manage Menu',
      'Manage Tables',
    ],
  },
  {
    name: 'Finance',
    permissions: [
      'View Revenue',
      'Manage Payments',
      'Manage Cash Register',
      'View Salary',
    ],
  },
  {
    name: 'Administration',
    permissions: [
      'Manage Users',
      'Manage Roles',
      'Manage Branches',
      'Manage Settings',
    ],
  },
];

const allPermissions = permissionGroups.flatMap(
  (group) => group.permissions
);

const getRoleInitials = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

const createRoleFromName = (name) => ({
  id: `role-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`,
  name,
  description: '',
  permissions: [],
});

const getStoredRoles = () => {
  try {
    const storedRoles = localStorage.getItem(
      'syncstays_roles'
    );

    if (!storedRoles) {
      return [];
    }

    const parsedRoles = JSON.parse(storedRoles);

    return Array.isArray(parsedRoles)
      ? parsedRoles
      : [];
  } catch {
    return [];
  }
};

const getStoredUsers = () => {
  try {
    const storedUsers = localStorage.getItem(
      'syncstays_users'
    );

    if (!storedUsers) {
      return [];
    }

    const parsedUsers = JSON.parse(storedUsers);

    return Array.isArray(parsedUsers)
      ? parsedUsers
      : [];
  } catch {
    return [];
  }
};

const getInitialRoles = (currentUser) => {
  const storedRoles = getStoredRoles();

  if (storedRoles.length > 0) {
    return storedRoles;
  }

  const users = getStoredUsers();

  if (users.length > 0) {
    const uniqueRoles = [
      ...new Set(
        users
          .map((user) => user.role)
          .filter(Boolean)
      ),
    ];

    return uniqueRoles.map((roleName, index) => ({
      id: `role-${index}-${roleName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')}`,
      name: roleName,
      description: '',
      permissions: [],
    }));
  }

  if (currentUser?.role) {
    return [
      {
        id: `role-${currentUser.role
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')}`,
        name: currentUser.role,
        description: '',
        permissions: [],
      },
    ];
  }

  return [];
};

const getUserCountForRole = (roleName) => {
  const users = getStoredUsers();

  return users.filter(
    (user) => user.role === roleName
  ).length;
};

export default function AdminRBACPage() {
  const { user: currentUser } = useAuth();

  const [roles, setRoles] = useState(() =>
    getInitialRoles(currentUser)
  );

  const [selectedRoleId, setSelectedRoleId] =
    useState(() => {
      const initialRoles =
        getInitialRoles(currentUser);

      return initialRoles[0]?.id || null;
    });

  const [showModal, setShowModal] =
    useState(false);

  const [newRoleName, setNewRoleName] =
    useState('');

  const [savedRoleSnapshots, setSavedRoleSnapshots] =
    useState(() => getInitialRoles(currentUser));

  const [showSavedMessage, setShowSavedMessage] =
    useState(false);

  const selectedRole = useMemo(
    () =>
      roles.find(
        (role) => role.id === selectedRoleId
      ) || roles[0] || null,
    [roles, selectedRoleId]
  );

  const savedRole = savedRoleSnapshots.find(
    (role) => role.id === selectedRole?.id
  );

  const hasUnsavedChanges = useMemo(() => {
    if (!selectedRole || !savedRole) {
      return false;
    }

    return (
      JSON.stringify(
        selectedRole.permissions || []
      ) !==
      JSON.stringify(
        savedRole.permissions || []
      )
    );
  }, [selectedRole, savedRole]);

  const hasPermission = (permission) => {
    if (!selectedRole) {
      return false;
    }

    if (selectedRole.permissions === 'all') {
      return true;
    }

    return (
      selectedRole.permissions?.includes(
        permission
      ) || false
    );
  };

  const persistRoles = (nextRoles) => {
    setRoles(nextRoles);

    localStorage.setItem(
      'syncstays_roles',
      JSON.stringify(nextRoles)
    );
  };

  const togglePermission = (permission) => {
    if (!selectedRole) {
      return;
    }

    if (selectedRole.permissions === 'all') {
      return;
    }

    setShowSavedMessage(false);

    setRoles((current) =>
      current.map((role) => {
        if (role.id !== selectedRole.id) {
          return role;
        }

        const currentPermissions =
          role.permissions || [];

        const exists =
          currentPermissions.includes(
            permission
          );

        return {
          ...role,
          permissions: exists
            ? currentPermissions.filter(
              (item) =>
                item !== permission
            )
            : [
              ...currentPermissions,
              permission,
            ],
        };
      })
    );
  };

  const saveChanges = () => {
    if (!selectedRole || !hasUnsavedChanges) {
      return;
    }

    const nextRoles = roles.map((role) =>
      role.id === selectedRole.id
        ? {
          ...role,
          permissions:
            selectedRole.permissions === 'all'
              ? 'all'
              : [
                ...(selectedRole.permissions ||
                  []),
              ],
        }
        : role
    );

    persistRoles(nextRoles);
    setSavedRoleSnapshots(nextRoles);
    setShowSavedMessage(true);

    window.setTimeout(() => {
      setShowSavedMessage(false);
    }, 2200);
  };

  const openCreateModal = () => {
    setNewRoleName('');
    setShowModal(true);
  };

  const closeCreateModal = () => {
    setShowModal(false);
    setNewRoleName('');
  };

  const createRole = (event) => {
    event.preventDefault();

    const name = newRoleName.trim();

    if (!name) {
      return;
    }

    const duplicate = roles.some(
      (role) =>
        role.name.toLowerCase() ===
        name.toLowerCase()
    );

    if (duplicate) {
      return;
    }

    const newRole = createRoleFromName(name);
    const nextRoles = [...roles, newRole];

    persistRoles(nextRoles);
    setSavedRoleSnapshots(nextRoles);
    setSelectedRoleId(newRole.id);

    closeCreateModal();
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <div className={styles.eyebrow}>
            ADMINISTRATION
          </div>

          <h1 className={styles.title}>
            Roles & Permissions
          </h1>

          <p className={styles.subtitle}>
            Control what each staff role can access
            across SyncStays.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={openCreateModal}
        >
          + Create Custom Role
        </Button>
      </header>

      <div className={styles.layout}>
        <aside className={styles.rolesPanel}>
          <div className={styles.panelHeader}>
            <div>
              <h2>Roles</h2>

              <span>
                {roles.length} configured roles
              </span>
            </div>
          </div>

          <div className={styles.roleList}>
            {roles.map((role) => {
              const userCount =
                getUserCountForRole(role.name);

              return (
                <button
                  type="button"
                  key={role.id}
                  className={`${styles.roleCard} ${role.id === selectedRoleId
                      ? styles.selectedRole
                      : ''
                    }`}
                  onClick={() =>
                    setSelectedRoleId(role.id)
                  }
                >
                  <div className={styles.roleIcon}>
                    {getRoleInitials(role.name)}
                  </div>

                  <div className={styles.roleInfo}>
                    <strong>{role.name}</strong>

                    <span>
                      {userCount} assigned users
                    </span>
                  </div>

                  <span className={styles.roleArrow}>
                    ›
                  </span>
                </button>
              );
            })}

            {roles.length === 0 && (
              <div className={styles.emptyRoles}>
                No roles configured yet.
              </div>
            )}
          </div>
        </aside>

        {selectedRole && (
          <section className={styles.permissionsPanel}>
            <div className={styles.permissionHeader}>
              <div>
                <div className={styles.roleEyebrow}>
                  SELECTED ROLE
                </div>

                <h2>{selectedRole.name}</h2>

                {selectedRole.description && (
                  <p>
                    {selectedRole.description}
                  </p>
                )}
              </div>

              <div
                className={styles.permissionSummary}
              >
                <strong>
                  {selectedRole.permissions === 'all'
                    ? allPermissions.length
                    : (
                      selectedRole.permissions ||
                      []
                    ).length}
                </strong>

                <span>Permissions</span>
              </div>
            </div>

            {selectedRole.permissions === 'all' && (
              <div className={styles.fullAccessBanner}>
                <strong>Full Access</strong>

                <span>
                  This role has unrestricted access
                  to all available modules and
                  permissions.
                </span>
              </div>
            )}

            <div className={styles.matrix}>
              {permissionGroups.map((group) => {
                const enabledCount =
                  group.permissions.filter(
                    hasPermission
                  ).length;

                return (
                  <div
                    className={
                      styles.permissionGroup
                    }
                    key={group.name}
                  >
                    <div
                      className={
                        styles.groupHeader
                      }
                    >
                      <span>{group.name}</span>

                      <span>
                        {enabledCount}/
                        {group.permissions.length}
                      </span>
                    </div>

                    {group.permissions.map(
                      (permission) => {
                        const enabled =
                          hasPermission(
                            permission
                          );

                        return (
                          <button
                            type="button"
                            key={permission}
                            className={
                              styles.permissionRow
                            }
                            onClick={() =>
                              togglePermission(
                                permission
                              )
                            }
                            disabled={
                              selectedRole.permissions ===
                              'all'
                            }
                            aria-pressed={enabled}
                          >
                            <div>
                              <strong>
                                {permission}
                              </strong>

                              <span>
                                Access to{' '}
                                {permission.toLowerCase()}.
                              </span>
                            </div>

                            <span
                              className={`${styles.toggle} ${enabled
                                  ? styles.toggleOn
                                  : ''
                                }`}
                            >
                              <span />
                            </span>
                          </button>
                        );
                      }
                    )}
                  </div>
                );
              })}
            </div>

            <div className={styles.saveBar}>
              <div className={styles.saveStatus}>
                {showSavedMessage ? (
                  <span
                    className={
                      styles.savedMessage
                    }
                  >
                    Changes saved
                  </span>
                ) : hasUnsavedChanges ? (
                  <span
                    className={
                      styles.unsavedMessage
                    }
                  >
                    Unsaved permission changes
                  </span>
                ) : (
                  <span>
                    Permission changes are applied
                    to the selected role.
                  </span>
                )}
              </div>

              <Button
                variant="primary"
                onClick={saveChanges}
                disabled={!hasUnsavedChanges}
              >
                Save Changes
              </Button>
            </div>
          </section>
        )}

        {!selectedRole && (
          <section className={styles.permissionsPanel}>
            <div className={styles.emptyRoles}>
              Create a role to configure permissions.
            </div>
          </section>
        )}
      </div>

      {showModal && (
        <div
          className={styles.modalOverlay}
          onMouseDown={closeCreateModal}
          role="presentation"
        >
          <form
            className={styles.modal}
            onSubmit={createRole}
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            <h2>Create Custom Role</h2>

            <p>
              Create a new role and configure its
              permissions.
            </p>

            <label>
              Role Name

              <input
                value={newRoleName}
                onChange={(event) =>
                  setNewRoleName(
                    event.target.value
                  )
                }
                placeholder="Role name"
                autoFocus
                required
              />
            </label>

            <div className={styles.modalActions}>
              <button
                type="button"
                onClick={closeCreateModal}
              >
                Cancel
              </button>

              <Button
                variant="primary"
                type="submit"
                disabled={!newRoleName.trim()}
              >
                Create Role
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}