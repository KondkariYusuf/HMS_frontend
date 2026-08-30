/**
 * @file Admin/SubModules/Index.jsx
 * @description Sub-Module management page with parent module integration, server-side pagination, search, and filtering.
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Button from '@components/Button/Button';
import moduleService from '@services/moduleService';
import subModuleService from '@services/subModuleService';
import styles from './Index.module.css';

const emptyForm = {
  moduleId: '',
  name: '',
  description: '',
  isActive: true,
};

export default function AdminSubModulesPage() {
  const [subModules, setSubModules] = useState([]);
  const [parentModules, setParentModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Server-side query state
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingSubModule, setEditingSubModule] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  // Delete confirmation state
  const [deletingSubModule, setDeletingSubModule] = useState(null);

  // Map for quick parent module name lookup by ID
  const parentModuleMap = useMemo(() => {
    const map = {};
    parentModules.forEach((m) => {
      if (m.id) {
        map[m.id] = m.name;
      }
    });
    return map;
  }, [parentModules]);

  // Load Parent Modules list for filter dropdown and modal selection
  const loadParentModules = useCallback(async () => {
    try {
      const res = await moduleService.getAll({ fetchAll: 'true', isActive: 'true' });
      if (res && res.success !== false) {
        const list = res?.data?.responses || res?.data?.rows || res?.data || [];
        if (Array.isArray(list)) {
          setParentModules(list);
        }
      }
    } catch (err) {
      console.warn('Parent modules lookup warning:', err);
    }
  }, []);

  useEffect(() => {
    loadParentModules();
  }, [loadParentModules]);

  // Fetch Sub-Modules list from server
  const fetchSubModules = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        limit,
        moduleData: 'true',
      };

      if (search.trim()) {
        params.search = search.trim();
      }

      if (moduleFilter !== 'All') {
        params.moduleId = moduleFilter;
      }

      if (statusFilter === 'Active') {
        params.isActive = 'true';
      } else if (statusFilter === 'Inactive') {
        params.isActive = 'false';
      }

      const res = await subModuleService.getAll(params);

      if (res && res.success !== false) {
        const responseData = res.data || {};
        const rows = responseData.responses || responseData.rows || [];
        setSubModules(rows);
        setTotalCount(responseData.totalCount || rows.length || 0);
        setTotalPages(responseData.totalPages || 1);
      } else {
        setError(res?.message || 'Failed to load sub-modules.');
        setSubModules([]);
      }
    } catch (err) {
      setError(err.message || 'Network error loading sub-modules.');
      setSubModules([]);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, moduleFilter, statusFilter]);

  useEffect(() => {
    fetchSubModules();
  }, [fetchSubModules]);

  // Reset page to 1 whenever search, module filter, or status filter changes
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleModuleFilterChange = (e) => {
    setModuleFilter(e.target.value);
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
    setEditingSubModule(null);
    setForm({
      ...emptyForm,
      moduleId: parentModules[0]?.id || '',
    });
    setShowModal(true);
  };

  // Open Edit Modal
  const openEdit = (subMod) => {
    setEditingSubModule(subMod);
    setForm({
      moduleId: subMod.moduleId || subMod.module?.id || subMod.moduleData?.id || '',
      name: subMod.name || '',
      description: subMod.description || '',
      isActive: subMod.isActive !== undefined ? Boolean(subMod.isActive) : true,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingSubModule(null);
    setForm(emptyForm);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Save Sub-Module (Create or Update)
  const saveSubModule = async (e) => {
    e.preventDefault();
    const name = form.name.trim();
    const moduleId = form.moduleId;

    if (!moduleId) {
      alert('Parent Module is required.');
      return;
    }

    if (!name || name.length < 2 || name.length > 100) {
      alert('Sub-module name must be between 2 and 100 characters.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        moduleId,
        name,
        description: form.description.trim() || undefined,
        isActive: form.isActive,
      };

      let res;
      if (editingSubModule) {
        res = await subModuleService.update(editingSubModule.id, payload);
      } else {
        res = await subModuleService.create(payload);
      }

      if (res && res.success !== false) {
        showToast(editingSubModule ? 'Sub-module updated successfully.' : 'Sub-module created successfully.');
        closeModal();
        fetchSubModules();
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
  const toggleStatus = async (subMod) => {
    try {
      const updatedStatus = !subMod.isActive;
      const res = await subModuleService.update(subMod.id, { isActive: updatedStatus });
      if (res && res.success !== false) {
        showToast(`Sub-module ${updatedStatus ? 'activated' : 'deactivated'} successfully.`);
        fetchSubModules();
      } else {
        alert(res?.message || 'Failed to update sub-module status.');
      }
    } catch (err) {
      alert(err.message || 'Error updating status.');
    }
  };

  // Delete Sub-Module
  const confirmDelete = async () => {
    if (!deletingSubModule) return;
    try {
      const res = await subModuleService.delete(deletingSubModule.id);
      if (res && res.success !== false) {
        showToast('Sub-module deleted successfully.');
        setDeletingSubModule(null);
        fetchSubModules();
      } else {
        alert(res?.message || 'Failed to delete sub-module.');
      }
    } catch (err) {
      alert(err.message || 'Error deleting sub-module.');
    }
  };

  return (
    <div className={styles.page}>
      {toastMessage && <div className={styles.toast}>{toastMessage}</div>}

      <header className={styles.header}>
        <div>
          <div className={styles.eyebrow}>ADMINISTRATION</div>
          <h1 className={styles.title}>Sub-Module Management</h1>
          <p className={styles.subtitle}>
            Manage granular sub-modules linked to parent system modules.
          </p>
        </div>

        <Button variant="primary" onClick={openCreate}>
          + Create Sub-Module
        </Button>
      </header>

      {/* Summary Stats */}
      <section className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span>Total Sub-Modules</span>
          <strong>{totalCount}</strong>
          <small>System-wide sub-modules</small>
        </div>

        <div className={styles.statCard}>
          <span>Parent Modules</span>
          <strong>{parentModules.length}</strong>
          <small>Available parent modules</small>
        </div>
      </section>

      {/* Toolbar & Filters */}
      <section className={styles.card}>
        <div className={styles.toolbar}>
          <div className={styles.searchWrap}>
            <span className={styles.searchIcon}>⌕</span>
            <input
              type="search"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search sub-modules by name or description..."
              aria-label="Search sub-modules"
            />
          </div>

          <div className={styles.filterGroup}>
            <select
              value={moduleFilter}
              onChange={handleModuleFilterChange}
              aria-label="Filter sub-modules by parent module"
              className={styles.selectFilter}
            >
              <option value="All">All Parent Modules</option>
              {parentModules.map((pm) => (
                <option key={pm.id} value={pm.id}>
                  {pm.name}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              aria-label="Filter sub-modules by status"
              className={styles.selectFilter}
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <div className={styles.tableWrap}>
          <table>
            <thead>
              <tr>
                <th>Sub-Module Name</th>
                <th>Parent Module</th>
                <th>Description</th>
                <th>Status</th>
                <th>Created At</th>
                <th aria-label="Actions">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6">
                    <div className={styles.loadingState}>Loading sub-modules...</div>
                  </td>
                </tr>
              ) : subModules.length === 0 ? (
                <tr>
                  <td colSpan="6">
                    <div className={styles.emptyState}>No sub-modules found.</div>
                  </td>
                </tr>
              ) : (
                subModules.map((subMod) => {
                  const parentName =
                    subMod.module?.name ||
                    subMod.moduleData?.name ||
                    parentModuleMap[subMod.moduleId] ||
                    '—';
                  const isActive = subMod.isActive !== false;

                  return (
                    <tr key={subMod.id}>
                      <td className={styles.nameCell}>
                        <strong>{subMod.name}</strong>
                      </td>
                      <td>
                        <span className={styles.moduleBadge}>{parentName}</span>
                      </td>
                      <td className={styles.descCell}>{subMod.description || '—'}</td>
                      <td>
                        <span className={`${styles.status} ${isActive ? styles.statusActive : styles.statusInactive}`}>
                          <i />
                          {isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className={styles.dateCell}>
                        {subMod.createdAt ? new Date(subMod.createdAt).toLocaleDateString() : '—'}
                      </td>
                      <td>
                        <div className={styles.actions}>
                          <button type="button" onClick={() => openEdit(subMod)}>
                            Edit
                          </button>
                          <button type="button" onClick={() => toggleStatus(subMod)}>
                            {isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            type="button"
                            className={styles.deleteBtn}
                            onClick={() => setDeletingSubModule(subMod)}
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
              Showing {subModules.length} of {totalCount} sub-modules (Page {page} of {totalPages})
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
            onSubmit={saveSubModule}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <div>
                <h2>{editingSubModule ? 'Edit Sub-Module' : 'Create Sub-Module'}</h2>
                <p>Configure granular sub-module details below.</p>
              </div>
              <button type="button" onClick={closeModal} className={styles.close} aria-label="Close modal">
                ×
              </button>
            </div>

            <label className={styles.label}>
              Parent Module *
              <select
                name="moduleId"
                value={form.moduleId}
                onChange={handleChange}
                required
              >
                <option value="">Select Parent Module</option>
                {parentModules.map((pm) => (
                  <option key={pm.id} value={pm.id}>
                    {pm.name}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.label}>
              Sub-Module Name *
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Room Occupancy"
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
                placeholder="Sub-module scope description..."
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
              Sub-Module is Active
            </label>

            <div className={styles.modalActions}>
              <button type="button" onClick={closeModal}>
                Cancel
              </button>
              <Button variant="primary" type="submit" disabled={submitting || !parentModules.length}>
                {submitting ? 'Saving...' : editingSubModule ? 'Save Changes' : 'Create Sub-Module'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingSubModule && (
        <div
          className={styles.modalOverlay}
          onMouseDown={() => setDeletingSubModule(null)}
          role="presentation"
        >
          <div className={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h2>Confirm Sub-Module Deletion</h2>
                <p>Are you sure you want to delete sub-module &quot;{deletingSubModule.name}&quot;?</p>
              </div>
              <button
                type="button"
                onClick={() => setDeletingSubModule(null)}
                className={styles.close}
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            <p className={styles.deleteWarning}>
              This action will soft-delete the sub-module.
            </p>

            <div className={styles.modalActions}>
              <button type="button" onClick={() => setDeletingSubModule(null)}>
                Cancel
              </button>
              <Button variant="danger" onClick={confirmDelete}>
                Delete Sub-Module
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
