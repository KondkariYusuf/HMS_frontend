/**
 * @file Admin/ModulePermissions/Index.jsx
 * @description Admin interface for mapping Sub-Modules to System Permissions (/api/module-permission) with frontend-only pagination.
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Button from '@components/Button/Button';
import moduleService from '@services/moduleService';
import subModuleService from '@services/subModuleService';
import permissionService from '@services/permissionService';
import modulePermissionService from '@services/modulePermissionService';
import styles from './Index.module.css';

const PERMS_PER_PAGE = 10;

export default function AdminModulePermissionsPage() {
  // Modules & Sub-Modules selection
  const [modules, setModules] = useState([]);
  const [subModules, setSubModules] = useState([]);
  const [selectedModuleId, setSelectedModuleId] = useState('');
  const [selectedSubModuleId, setSelectedSubModuleId] = useState('');

  // System permissions & assigned mappings
  const [systemPermissions, setSystemPermissions] = useState([]);
  const [selectedPermissionIds, setSelectedPermissionIds] = useState(new Set());
  const [initialAssignedIds, setInitialAssignedIds] = useState(new Set());

  // Search & frontend-only pagination for permissions
  const [permSearch, setPermSearch] = useState('');
  const [permPage, setPermPage] = useState(1);

  // UI state
  const [loadingModules, setLoadingModules] = useState(true);
  const [loadingSubModules, setLoadingSubModules] = useState(false);
  const [loadingPermissions, setLoadingPermissions] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Clear confirmation modal state
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // 1. Load active parent Modules on mount
  const loadModules = useCallback(async () => {
    setLoadingModules(true);
    setError(null);
    try {
      const res = await moduleService.getAll({ fetchAll: 'true', isActive: 'true' });
      if (res && res.success !== false) {
        const list = res?.data?.responses || res?.data?.rows || res?.data || [];
        const activeList = Array.isArray(list) ? list : [];
        setModules(activeList);
        if (activeList.length > 0) {
          setSelectedModuleId(activeList[0].id);
        }
      } else {
        setError(res?.message || 'Failed to load modules.');
      }
    } catch (err) {
      setError(err.message || 'Error loading modules.');
    } finally {
      setLoadingModules(false);
    }
  }, []);

  // 2. Load all system permissions on mount (MUST use fetchAll=true to load complete dataset)
  const loadSystemPermissions = useCallback(async () => {
    try {
      const res = await permissionService.getPermissions({ fetchAll: 'true' });
      if (res && res.success !== false) {
        const responseData = res.data || {};
        const list = responseData.responses || responseData.rows || (Array.isArray(res.data) ? res.data : []);
        setSystemPermissions(Array.isArray(list) ? list : []);
      }
    } catch (err) {
      console.warn('System permissions loading warning:', err);
    }
  }, []);

  useEffect(() => {
    loadModules();
    loadSystemPermissions();
  }, [loadModules, loadSystemPermissions]);

  // 3. Load Sub-Modules whenever selectedModuleId changes
  useEffect(() => {
    if (!selectedModuleId) {
      setSubModules([]);
      setSelectedSubModuleId('');
      return;
    }

    async function loadSubModules() {
      setLoadingSubModules(true);
      setSelectedSubModuleId('');
      setSelectedPermissionIds(new Set());
      setInitialAssignedIds(new Set());
      setPermPage(1);
      try {
        const res = await subModuleService.getAll({
          moduleId: selectedModuleId,
          fetchAll: 'true',
          isActive: 'true',
        });
        if (res && res.success !== false) {
          const responseData = res.data || {};
          const list = responseData.responses || responseData.rows || (Array.isArray(res.data) ? res.data : []);
          const activeSubModules = Array.isArray(list) ? list : [];
          setSubModules(activeSubModules);
          if (activeSubModules.length > 0) {
            setSelectedSubModuleId(activeSubModules[0].id);
          }
        } else {
          setSubModules([]);
        }
      } catch (err) {
        console.warn('Sub-modules fetch warning:', err);
        setSubModules([]);
      } finally {
        setLoadingSubModules(false);
      }
    }

    loadSubModules();
  }, [selectedModuleId]);

  // 4. Load assigned mappings whenever selectedSubModuleId changes
  const loadAssignedPermissions = useCallback(async () => {
    if (!selectedSubModuleId) {
      setSelectedPermissionIds(new Set());
      setInitialAssignedIds(new Set());
      setPermPage(1);
      return;
    }

    setLoadingPermissions(true);
    setPermPage(1);
    try {
      const res = await modulePermissionService.getAll({
        subModuleId: selectedSubModuleId,
        fetchAll: 'true',
      });

      if (res && res.success !== false) {
        const responseData = res.data || {};
        const mappings = responseData.responses || responseData.rows || (Array.isArray(res.data) ? res.data : []);

        const assignedSet = new Set();
        if (Array.isArray(mappings)) {
          mappings.forEach((item) => {
            const permId = item.permissionId || item.permissionData?.id || item.id;
            if (permId) {
              assignedSet.add(permId);
            }
          });
        }

        setSelectedPermissionIds(new Set(assignedSet));
        setInitialAssignedIds(new Set(assignedSet));
      } else {
        setSelectedPermissionIds(new Set());
        setInitialAssignedIds(new Set());
      }
    } catch (err) {
      console.warn('Assigned permissions fetch warning:', err);
      setSelectedPermissionIds(new Set());
      setInitialAssignedIds(new Set());
    } finally {
      setLoadingPermissions(false);
    }
  }, [selectedSubModuleId]);

  useEffect(() => {
    loadAssignedPermissions();
  }, [loadAssignedPermissions]);

  // Filter full system permissions dataset by search query
  const filteredPermissions = useMemo(() => {
    const q = permSearch.trim().toLowerCase();
    if (!q) return systemPermissions;
    return systemPermissions.filter((p) => {
      const code = p.code?.toLowerCase() || '';
      const actionName = p.actionName?.toLowerCase() || '';
      const method = p.method?.toLowerCase() || '';
      const path = p.path?.toLowerCase() || '';
      const desc = p.description?.toLowerCase() || '';
      return (
        code.includes(q) ||
        actionName.includes(q) ||
        method.includes(q) ||
        path.includes(q) ||
        desc.includes(q)
      );
    });
  }, [systemPermissions, permSearch]);

  // Handle search input change (resets permission page to 1)
  const handlePermSearchChange = (e) => {
    setPermSearch(e.target.value);
    setPermPage(1);
  };

  // Calculate frontend-only pagination slice of 10 items
  const totalPermPages = useMemo(() => {
    return Math.ceil(filteredPermissions.length / PERMS_PER_PAGE) || 1;
  }, [filteredPermissions.length]);

  const displayedPermissions = useMemo(() => {
    const start = (permPage - 1) * PERMS_PER_PAGE;
    return filteredPermissions.slice(start, start + PERMS_PER_PAGE);
  }, [filteredPermissions, permPage]);

  const startCount = filteredPermissions.length === 0 ? 0 : (permPage - 1) * PERMS_PER_PAGE + 1;
  const endCount = Math.min(permPage * PERMS_PER_PAGE, filteredPermissions.length);

  // Toggle single permission selection in global Set
  const togglePermission = (permId) => {
    setSelectedPermissionIds((prev) => {
      const next = new Set(prev);
      if (next.has(permId)) {
        next.delete(permId);
      } else {
        next.add(permId);
      }
      return next;
    });
  };

  // Select All filtered permissions across the ENTIRE dataset (not just 10 visible rows)
  const selectAll = () => {
    setSelectedPermissionIds((prev) => {
      const next = new Set(prev);
      filteredPermissions.forEach((p) => next.add(p.id));
      return next;
    });
  };

  // Clear current selection globally
  const clearSelection = () => {
    setSelectedPermissionIds(new Set());
  };

  // Compute unsaved changes status
  const hasUnsavedChanges = useMemo(() => {
    if (selectedPermissionIds.size !== initialAssignedIds.size) return true;
    for (const id of selectedPermissionIds) {
      if (!initialAssignedIds.has(id)) return true;
    }
    return false;
  }, [selectedPermissionIds, initialAssignedIds]);

  // Save changes handler
  const saveMapping = async () => {
    if (!selectedSubModuleId) {
      alert('Please select a Sub-Module first.');
      return;
    }

    const permissionIdsArray = Array.from(selectedPermissionIds);
    setSaving(true);
    try {
      let res;
      // If user selected 0 permissions, call DELETE /api/module-permission/:subModuleId
      if (permissionIdsArray.length === 0) {
        res = await modulePermissionService.delete(selectedSubModuleId);
      } else {
        // Backend validator requires min 1 permissionId array item. Safely send PUT /api/module-permission/:subModuleId
        res = await modulePermissionService.update(selectedSubModuleId, {
          permissionIds: permissionIdsArray,
        });
      }

      if (res && res.success !== false) {
        showToast('Module permission mapping saved successfully.');
        setInitialAssignedIds(new Set(selectedPermissionIds));
        loadAssignedPermissions();
      } else {
        alert(res?.message || 'Failed to save module permissions.');
      }
    } catch (err) {
      alert(err.message || 'An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  // Clear all mappings confirmation execution
  const executeClearAll = async () => {
    if (!selectedSubModuleId) return;
    setSaving(true);
    try {
      const res = await modulePermissionService.delete(selectedSubModuleId);
      if (res && res.success !== false) {
        showToast('All permissions cleared for selected Sub-Module.');
        setSelectedPermissionIds(new Set());
        setInitialAssignedIds(new Set());
        setShowClearConfirm(false);
      } else {
        alert(res?.message || 'Failed to clear permissions.');
      }
    } catch (err) {
      alert(err.message || 'Error clearing permissions.');
    } finally {
      setSaving(false);
    }
  };

  const selectedSubModule = useMemo(() => {
    return subModules.find((sm) => sm.id === selectedSubModuleId) || null;
  }, [subModules, selectedSubModuleId]);

  return (
    <div className={styles.page}>
      {toastMessage && <div className={styles.toast}>{toastMessage}</div>}

      <header className={styles.header}>
        <div>
          <div className={styles.eyebrow}>ADMINISTRATION</div>
          <h1 className={styles.title}>Module Permission Mapping</h1>
          <p className={styles.subtitle}>
            Assign system permissions to sub-modules (`Sub-Module ↔ Permission`).
          </p>
        </div>
      </header>

      {error && <div className={styles.errorMessage}>{error}</div>}

      {/* Main Layout: Left Controls, Right Permission Matrix */}
      <div className={styles.layout}>
        {/* Left Column: Select Module & Sub-Module */}
        <aside className={styles.selectionPanel}>
          <div className={styles.panelHeader}>
            <h2>Select Scope</h2>
            <span>Choose parent module and target sub-module</span>
          </div>

          <div className={styles.selectionBody}>
            <label className={styles.fieldLabel}>
              Parent Module
              <select
                value={selectedModuleId}
                onChange={(e) => setSelectedModuleId(e.target.value)}
                disabled={loadingModules || modules.length === 0}
                className={styles.selectInput}
              >
                {loadingModules ? (
                  <option>Loading modules...</option>
                ) : modules.length === 0 ? (
                  <option>No active modules found</option>
                ) : (
                  modules.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))
                )}
              </select>
            </label>

            <div className={styles.subModuleSection}>
              <div className={styles.sectionTitle}>
                <span>Sub-Modules</span>
                <span className={styles.countBadge}>{subModules.length} available</span>
              </div>

              {loadingSubModules ? (
                <div className={styles.loadingState}>Loading sub-modules...</div>
              ) : subModules.length === 0 ? (
                <div className={styles.emptySubState}>
                  No active sub-modules found for this module.
                </div>
              ) : (
                <div className={styles.subModuleList}>
                  {subModules.map((sm) => (
                    <button
                      type="button"
                      key={sm.id}
                      className={`${styles.subModuleCard} ${
                        sm.id === selectedSubModuleId ? styles.selectedSubCard : ''
                      }`}
                      onClick={() => setSelectedSubModuleId(sm.id)}
                    >
                      <div className={styles.subCardInfo}>
                        <strong>{sm.name}</strong>
                        <span>{sm.description || 'No description'}</span>
                      </div>
                      <span className={styles.subCardArrow}>›</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Right Column: Permissions Matrix */}
        <section className={styles.matrixPanel}>
          {selectedSubModule ? (
            <>
              <div className={styles.matrixHeader}>
                <div>
                  <div className={styles.targetEyebrow}>TARGET SUB-MODULE</div>
                  <h2>{selectedSubModule.name}</h2>
                  {selectedSubModule.description && <p>{selectedSubModule.description}</p>}
                </div>

                <div className={styles.summaryBadge}>
                  <strong>{selectedPermissionIds.size}</strong>
                  <span>Permissions Selected</span>
                </div>
              </div>

              {/* Toolbar & Search */}
              <div className={styles.matrixToolbar}>
                <div className={styles.searchWrap}>
                  <span className={styles.searchIcon}>⌕</span>
                  <input
                    type="search"
                    value={permSearch}
                    onChange={handlePermSearchChange}
                    placeholder="Search permissions by action, code, method or path..."
                    aria-label="Search permissions"
                  />
                </div>

                <div className={styles.batchActions}>
                  <button type="button" onClick={selectAll}>
                    Select All ({filteredPermissions.length})
                  </button>
                  <button type="button" onClick={clearSelection}>
                    Clear Selection
                  </button>
                </div>
              </div>

              {/* System Permissions List (Paginated Display) */}
              <div className={styles.permissionsList}>
                {loadingPermissions ? (
                  <div className={styles.loadingState}>Loading permissions...</div>
                ) : displayedPermissions.length === 0 ? (
                  <div className={styles.emptyPermissions}>No matching permissions found.</div>
                ) : (
                  displayedPermissions.map((perm) => {
                    const isChecked = selectedPermissionIds.has(perm.id);
                    const method = (perm.method || 'GET').toUpperCase();

                    return (
                      <label
                        key={perm.id}
                        className={`${styles.permissionRow} ${
                          isChecked ? styles.permissionChecked : ''
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => togglePermission(perm.id)}
                          className={styles.checkbox}
                        />

                        <div className={styles.permDetails}>
                          <div className={styles.permTitleRow}>
                            <span className={styles.permAction}>
                              {perm.actionName || perm.code}
                            </span>
                            <span
                              className={`${styles.methodBadge} ${
                                styles[`method_${method}`] || ''
                              }`}
                            >
                              {method}
                            </span>
                            {perm.code && <span className={styles.codeTag}>{perm.code}</span>}
                          </div>

                          <div className={styles.permPathRow}>
                            {perm.path && <code>{perm.path}</code>}
                            {perm.description && (
                              <span className={styles.permDesc}>{perm.description}</span>
                            )}
                          </div>
                        </div>
                      </label>
                    );
                  })
                )}
              </div>

              {/* Frontend-Only Permission Pagination Bar */}
              {!loadingPermissions && filteredPermissions.length > 0 && (
                <div className={styles.permPaginationBar}>
                  <span>
                    Showing {startCount}–{endCount} of {filteredPermissions.length} permissions
                  </span>

                  <div className={styles.permPaginationBtns}>
                    <button
                      type="button"
                      disabled={permPage <= 1}
                      onClick={() => setPermPage((p) => Math.max(1, p - 1))}
                    >
                      Previous
                    </button>
                    <span className={styles.permPageNum}>
                      Page {permPage} of {totalPermPages}
                    </span>
                    <button
                      type="button"
                      disabled={permPage >= totalPermPages}
                      onClick={() => setPermPage((p) => Math.min(totalPermPages, p + 1))}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

              {/* Save / Clear Footer Bar */}
              <div className={styles.saveBar}>
                <div className={styles.saveStatus}>
                  {hasUnsavedChanges ? (
                    <span className={styles.unsavedMessage}>● Unsaved permission changes</span>
                  ) : (
                    <span>Permissions are saved for this sub-module.</span>
                  )}
                </div>

                <div className={styles.saveActions}>
                  <button
                    type="button"
                    className={styles.clearAllBtn}
                    onClick={() => setShowClearConfirm(true)}
                    disabled={saving || initialAssignedIds.size === 0}
                  >
                    Clear All Mappings
                  </button>

                  <Button
                    variant="primary"
                    onClick={saveMapping}
                    disabled={saving || !hasUnsavedChanges}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className={styles.noSubSelected}>
              {loadingModules || loadingSubModules ? (
                <span>Loading available scope...</span>
              ) : (
                <span>Select a Sub-Module from the left panel to configure permissions.</span>
              )}
            </div>
          )}
        </section>
      </div>

      {/* Clear All Confirmation Modal */}
      {showClearConfirm && (
        <div
          className={styles.modalOverlay}
          onMouseDown={() => setShowClearConfirm(false)}
          role="presentation"
        >
          <div className={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h2>Clear All Permissions</h2>
                <p>
                  Are you sure you want to remove all permission mappings for sub-module &quot;
                  {selectedSubModule?.name}&quot;?
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className={styles.close}
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            <p className={styles.deleteWarning}>
              This action will execute a `DELETE` request to clear all mapped permissions for this sub-module on the server.
            </p>

            <div className={styles.modalActions}>
              <button type="button" onClick={() => setShowClearConfirm(false)}>
                Cancel
              </button>
              <Button variant="danger" onClick={executeClearAll} disabled={saving}>
                {saving ? 'Clearing...' : 'Clear All Mappings'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
