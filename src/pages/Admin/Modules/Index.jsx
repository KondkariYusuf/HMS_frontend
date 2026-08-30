/**
 * @file Admin/Modules/Index.jsx
 * @description Module management page supporting server-side pagination, search, status filtering, and CRUD.
 */

import React, { useCallback, useEffect, useState } from 'react';
import Button from '@components/Button/Button';
import moduleService from '@services/moduleService';
import styles from './Index.module.css';

const emptyForm = {
  name: '',
  description: '',
  isActive: true,
};

export default function AdminModulesPage() {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Server-side query state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  // Delete confirmation modal state
  const [deletingModule, setDeletingModule] = useState(null);

  // Fetch modules from server
  const fetchModules = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        limit,
        subModuleData: 'true',
      };

      if (search.trim()) {
        params.search = search.trim();
      }

      if (statusFilter === 'Active') {
        params.isActive = 'true';
      } else if (statusFilter === 'Inactive') {
        params.isActive = 'false';
      }

      const res = await moduleService.getAll(params);

      if (res && res.success !== false) {
        const responseData = res.data || {};
        const rows = responseData.responses || responseData.rows || [];
        setModules(rows);
        setTotalCount(responseData.totalCount || rows.length || 0);
        setTotalPages(responseData.totalPages || 1);
      } else {
        setError(res?.message || 'Failed to load modules.');
        setModules([]);
      }
    } catch (err) {
      setError(err.message || 'Network error loading modules.');
      setModules([]);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, statusFilter]);

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  // Reset page to 1 whenever search or status filter changes
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setPage(1);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Open Create Modal
  const openCreate = () => {
    setEditingModule(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  // Open Edit Modal
  const openEdit = (mod) => {
    setEditingModule(mod);
    setForm({
      name: mod.name || '',
      description: mod.description || '',
      isActive: mod.isActive !== undefined ? Boolean(mod.isActive) : true,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingModule(null);
    setForm(emptyForm);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Save Module (Create or Update)
  const saveModule = async (e) => {
    e.preventDefault();
    const name = form.name.trim();
    if (!name || name.length < 2 || name.length > 100) {
      alert('Module name must be between 2 and 100 characters.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name,
        description: form.description.trim() || undefined,
        isActive: form.isActive,
      };

      let res;
      if (editingModule) {
        res = await moduleService.update(editingModule.id, payload);
      } else {
        res = await moduleService.create(payload);
      }

      if (res && res.success !== false) {
        showToast(editingModule ? 'Module updated successfully.' : 'Module created successfully.');
        closeModal();
        fetchModules();
      } else {
        alert(res?.message || 'Operation failed.');
      }
    } catch (err) {
      alert(err.message || 'An unexpected error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle Active/Inactive Status
  const toggleStatus = async (mod) => {
    try {
      const updatedStatus = !mod.isActive;
      const res = await moduleService.update(mod.id, { isActive: updatedStatus });
      if (res && res.success !== false) {
        showToast(`Module ${updatedStatus ? 'activated' : 'deactivated'} successfully.`);
        fetchModules();
      } else {
        alert(res?.message || 'Failed to update module status.');
      }
    } catch (err) {
      alert(err.message || 'Error updating status.');
    }
  };

  // Delete Module
  const confirmDelete = async () => {
    if (!deletingModule) return;
    try {
      const res = await moduleService.delete(deletingModule.id);
      if (res && res.success !== false) {
        showToast('Module deleted successfully.');
        setDeletingModule(null);
        fetchModules();
      } else {
        alert(res?.message || 'Failed to delete module.');
      }
    } catch (err) {
      alert(err.message || 'Error deleting module.');
    }
  };

  return (
    <div className={styles.page}>
      {toastMessage && <div className={styles.toast}>{toastMessage}</div>}

      <header className={styles.header}>
        <div>
          <div className={styles.eyebrow}>ADMINISTRATION</div>
          <h1 className={styles.title}>Module Management</h1>
          <p className={styles.subtitle}>
            Configure high-level system modules and manage their operational status.
          </p>
        </div>

        <Button variant="primary" onClick={openCreate}>
          + Create Module
        </Button>
      </header>

      {/* Summary Stats */}
      <section className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span>Total Modules</span>
          <strong>{totalCount}</strong>
          <small>System-wide modules</small>
        </div>

        <div className={styles.statCard}>
          <span>Current Page</span>
          <strong>{page} / {totalPages || 1}</strong>
          <small>{limit} per page</small>
        </div>
      </section>

      {/* Filters Toolbar & Table */}
      <section className={styles.card}>
        <div className={styles.toolbar}>
          <div className={styles.searchWrap}>
            <span className={styles.searchIcon}>⌕</span>
            <input
              type="search"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search modules by name or description..."
              aria-label="Search modules"
            />
          </div>

          <select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            aria-label="Filter modules by status"
            className={styles.statusSelect}
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <div className={styles.tableWrap}>
          <table>
            <thead>
              <tr>
                <th>Module Name</th>
                <th>Description</th>
                <th>Sub-Modules</th>
                <th>Status</th>
                <th>Created At</th>
                <th aria-label="Actions">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6">
                    <div className={styles.loadingState}>Loading modules...</div>
                  </td>
                </tr>
              ) : modules.length === 0 ? (
                <tr>
                  <td colSpan="6">
                    <div className={styles.emptyState}>No modules found.</div>
                  </td>
                </tr>
              ) : (
                modules.map((mod) => {
                  const subCount = Array.isArray(mod.subModuleData) ? mod.subModuleData.length : 0;
                  const isActive = mod.isActive !== false;

                  return (
                    <tr key={mod.id}>
                      <td className={styles.nameCell}>
                        <strong>{mod.name}</strong>
                      </td>
                      <td className={styles.descCell}>{mod.description || '—'}</td>
                      <td>
                        <span className={styles.subBadge}>{subCount} sub-modules</span>
                      </td>
                      <td>
                        <span className={`${styles.status} ${isActive ? styles.statusActive : styles.statusInactive}`}>
                          <i />
                          {isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className={styles.dateCell}>
                        {mod.createdAt ? new Date(mod.createdAt).toLocaleDateString() : '—'}
                      </td>
                      <td>
                        <div className={styles.actions}>
                          <button type="button" onClick={() => openEdit(mod)}>
                            Edit
                          </button>
                          <button type="button" onClick={() => toggleStatus(mod)}>
                            {isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            type="button"
                            className={styles.deleteBtn}
                            onClick={() => setDeletingModule(mod)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Server-Side Pagination Controls */}
        {!loading && totalCount > 0 && (
          <div className={styles.tableFooter}>
            <span>
              Showing {modules.length} of {totalCount} modules (Page {page} of {totalPages})
            </span>

            <div className={styles.paginationBtns}>
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </button>

              <span className={styles.pageNumber}>{page}</span>

              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Create / Edit Modal */}
      {showModal && (
        <div className={styles.modalOverlay} onMouseDown={closeModal} role="presentation">
          <form
            className={styles.modal}
            onSubmit={saveModule}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <div>
                <h2>{editingModule ? 'Edit Module' : 'Create Module'}</h2>
                <p>Configure higher-level domain module details below.</p>
              </div>
              <button type="button" onClick={closeModal} className={styles.close} aria-label="Close modal">
                ×
              </button>
            </div>

            <label className={styles.label}>
              Module Name *
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Housekeeping"
                autoFocus
                required
                minLength={2}
                maxLength={100}
              />
            </label>

            <label className={styles.label}>
              Description
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Module scope description..."
                rows={3}
              />
            </label>

            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={handleChange}
              />
              Module is Active
            </label>

            <div className={styles.modalActions}>
              <button type="button" onClick={closeModal}>
                Cancel
              </button>
              <Button variant="primary" type="submit" disabled={submitting}>
                {submitting ? 'Saving...' : editingModule ? 'Save Changes' : 'Create Module'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingModule && (
        <div
          className={styles.modalOverlay}
          onMouseDown={() => setDeletingModule(null)}
          role="presentation"
        >
          <div className={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h2>Confirm Module Deletion</h2>
                <p>Are you sure you want to delete module &quot;{deletingModule.name}&quot;?</p>
              </div>
              <button
                type="button"
                onClick={() => setDeletingModule(null)}
                className={styles.close}
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            <p className={styles.deleteWarning}>
              This action will soft-delete the module. Sub-modules linked to this module will remain in the database.
            </p>

            <div className={styles.modalActions}>
              <button type="button" onClick={() => setDeletingModule(null)}>
                Cancel
              </button>
              <Button variant="danger" onClick={confirmDelete}>
                Delete Module
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
