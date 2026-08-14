/**
 * @file Admin/Users/Index.jsx
 * @description Frontend user directory and account management screen.
 */

import React, { useMemo, useState } from 'react';
import Button from '@components/Button/Button';
import { useAuth } from '@hooks/useAuth';
import styles from './Index.module.css';

const getInitials = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

const getEmptyForm = (branches, roles) => ({
  name: '',
  email: '',
  role: roles[0] || '',
  branch: branches[0]?.name || '',
});

export default function AdminUsersPage() {
  const {
    user: currentUser,
    branches,
  } = useAuth();

  const [users, setUsers] = useState(() => {
    try {
      const storedUsers = localStorage.getItem('syncstays_users');

      if (storedUsers) {
        const parsedUsers = JSON.parse(storedUsers);

        if (Array.isArray(parsedUsers)) {
          return parsedUsers;
        }
      }
    } catch {
      // Fall back to the authenticated user below.
    }

    if (!currentUser) {
      return [];
    }

    return [
      {
        id: `user-${Date.now()}`,
        name: currentUser.name || '',
        email: currentUser.email || '',
        role: currentUser.role || '',
        branch:
          branches?.find(
            (branch) =>
              branch.id === localStorage.getItem('syncstays_branch_id')
          )?.name || branches?.[0]?.name || '',
        status: 'Active',
        lastActive: 'Current session',
        initials: getInitials(currentUser.name),
      },
    ];
  });

  const roles = useMemo(() => {
    const uniqueRoles = users
      .map((item) => item.role)
      .filter(Boolean);

    if (currentUser?.role) {
      uniqueRoles.push(currentUser.role);
    }

    return [...new Set(uniqueRoles)];
  }, [users, currentUser]);

  const branchOptions = useMemo(
    () => branches?.map((branch) => branch.name).filter(Boolean) || [],
    [branches]
  );

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState(
    getEmptyForm(branchOptions, roles)
  );

  const persistUsers = (nextUsers) => {
    setUsers(nextUsers);
    localStorage.setItem(
      'syncstays_users',
      JSON.stringify(nextUsers)
    );
  };

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((item) => {
      const matchesSearch =
        !query ||
        item.name?.toLowerCase().includes(query) ||
        item.email?.toLowerCase().includes(query) ||
        item.role?.toLowerCase().includes(query) ||
        item.branch?.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === 'All' ||
        item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [users, search, statusFilter]);

  const openCreate = () => {
    setEditingUser(null);
    setForm(getEmptyForm(branchOptions, roles));
    setShowModal(true);
  };

  const openEdit = (selectedUser) => {
    setEditingUser(selectedUser);

    setForm({
      name: selectedUser.name || '',
      email: selectedUser.email || '',
      role: selectedUser.role || roles[0] || '',
      branch:
        selectedUser.branch ||
        branchOptions[0] ||
        '',
    });

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
  };

  const saveUser = (event) => {
    event.preventDefault();

    const name = form.name.trim();
    const email = form.email.trim();

    if (!name || !email) {
      return;
    }

    if (editingUser) {
      const nextUsers = users.map((item) =>
        item.id === editingUser.id
          ? {
            ...item,
            name,
            email,
            role: form.role,
            branch: form.branch,
            initials: getInitials(name),
          }
          : item
      );

      persistUsers(nextUsers);
    } else {
      const newUser = {
        id: `user-${Date.now()}`,
        name,
        email,
        role: form.role,
        branch: form.branch,
        status: 'Invited',
        lastActive: 'Pending',
        initials: getInitials(name),
      };

      persistUsers([...users, newUser]);
    }

    closeModal();
  };

  const toggleStatus = (userId) => {
    const nextUsers = users.map((item) => {
      if (item.id !== userId) {
        return item;
      }

      return {
        ...item,
        status:
          item.status === 'Active'
            ? 'Inactive'
            : 'Active',
      };
    });

    persistUsers(nextUsers);
  };

  const activeCount = users.filter(
    (item) => item.status === 'Active'
  ).length;

  const invitedCount = users.filter(
    (item) => item.status === 'Invited'
  ).length;

  const inactiveCount = users.filter(
    (item) => item.status === 'Inactive'
  ).length;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <div className={styles.eyebrow}>
            ADMINISTRATION
          </div>

          <h1 className={styles.title}>
            User Directory
          </h1>

          <p className={styles.subtitle}>
            Manage staff accounts, roles, branches and access.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={openCreate}
        >
          + Invite User
        </Button>
      </header>

      <section className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span>Total Users</span>
          <strong>{users.length}</strong>
          <small>Across all branches</small>
        </div>

        <div className={styles.statCard}>
          <span>Active</span>
          <strong>{activeCount}</strong>
          <small>Currently enabled</small>
        </div>

        <div className={styles.statCard}>
          <span>Pending Invites</span>
          <strong>{invitedCount}</strong>
          <small>Awaiting acceptance</small>
        </div>

        <div className={styles.statCard}>
          <span>Inactive</span>
          <strong>{inactiveCount}</strong>
          <small>Access disabled</small>
        </div>
      </section>

      <section className={styles.card}>
        <div className={styles.toolbar}>
          <div className={styles.searchWrap}>
            <span className={styles.searchIcon}>
              ⌕
            </span>

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search users, roles or branches..."
              aria-label="Search users"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            aria-label="Filter users by status"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Invited">Invited</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className={styles.tableWrap}>
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Branch</th>
                <th>Status</th>
                <th>Last Active</th>
                <th aria-label="Actions" />
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className={styles.userCell}>
                      <div className={styles.avatar}>
                        {item.initials}
                      </div>

                      <div>
                        <strong>{item.name}</strong>
                        <span>{item.email}</span>
                      </div>
                    </div>
                  </td>

                  <td>{item.role}</td>

                  <td>{item.branch}</td>

                  <td>
                    <span
                      className={`${styles.status} ${styles[item.status?.toLowerCase()]
                        }`}
                    >
                      <i />
                      {item.status}
                    </span>
                  </td>

                  <td className={styles.lastActive}>
                    {item.lastActive}
                  </td>

                  <td>
                    <div className={styles.actions}>
                      <button
                        type="button"
                        onClick={() => openEdit(item)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleStatus(item.id)}
                      >
                        {item.status === 'Active'
                          ? 'Disable'
                          : 'Enable'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="6">
                    <div className={styles.empty}>
                      No users match your search.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className={styles.tableFooter}>
          Showing {filteredUsers.length} of {users.length} users
        </div>
      </section>

      {showModal && (
        <div
          className={styles.modalOverlay}
          onMouseDown={closeModal}
          role="presentation"
        >
          <form
            className={styles.modal}
            onSubmit={saveUser}
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            <div className={styles.modalHeader}>
              <div>
                <h2>
                  {editingUser
                    ? 'Edit User'
                    : 'Invite User'}
                </h2>

                <p>
                  {editingUser
                    ? 'Update account information and access.'
                    : 'Create an account invitation for a staff member.'}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className={styles.close}
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            <label>
              Full Name

              <input
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                placeholder="Full name"
                autoFocus
                required
              />
            </label>

            <label>
              Email Address

              <input
                type="email"
                value={form.email}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
                placeholder="Email address"
                required
              />
            </label>

            <div className={styles.formGrid}>
              <label>
                Role

                <select
                  value={form.role}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      role: event.target.value,
                    }))
                  }
                  disabled={!roles.length}
                >
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Primary Branch

                <select
                  value={form.branch}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      branch: event.target.value,
                    }))
                  }
                  disabled={!branchOptions.length}
                >
                  {branchOptions.map((branch) => (
                    <option
                      key={branch}
                      value={branch}
                    >
                      {branch}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className={styles.modalActions}>
              <button
                type="button"
                onClick={closeModal}
              >
                Cancel
              </button>

              <Button
                variant="primary"
                type="submit"
              >
                {editingUser
                  ? 'Save Changes'
                  : 'Send Invitation'}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}