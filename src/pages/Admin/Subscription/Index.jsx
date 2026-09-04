/**
 * @file Admin/Subscription/Index.jsx
 * @description Organization subscription plan, tier limits, and module assignment.
 * Bound to `subscriptionService` and `moduleService` API modules.
 */
import React, { useCallback, useEffect, useState } from 'react';
import Button from '@components/Button/Button';
import { subscriptionService } from '@services/subscriptionService';
import moduleService from '@services/moduleService';
import styles from './Index.module.css';

const DEFAULT_RESOURCE_CODES = [
  'MAX_USERS',
  'MAX_STORAGE_GB',
  'MAX_ROOMS',
  'MAX_BRANCHES',
];

const emptyCreateForm = {
  name: '',
  description: '',
  priceMonthly: '',
  priceYearly: '',
  trialDays: 14,
  isActive: true,
};

export default function AdminSubscriptionPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  // Create Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState(emptyCreateForm);
  const [creating, setCreating] = useState(false);

  // Edit / Manage Modal State
  const [editingPlan, setEditingPlan] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [editTab, setEditTab] = useState('details'); // 'details' | 'modules' | 'limits'
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    priceMonthly: 0,
    priceYearly: 0,
    trialDays: 0,
    isActive: true,
  });
  const [savingDetails, setSavingDetails] = useState(false);

  // System Modules & Resource Limits for Active Plan
  const [allModules, setAllModules] = useState([]);
  const [planModules, setPlanModules] = useState([]);
  const [planLimits, setPlanLimits] = useState([]);
  const [togglingModuleId, setTogglingModuleId] = useState(null);

  // New limit inputs
  const [newLimitCode, setNewLimitCode] = useState('MAX_USERS');
  const [newLimitValue, setNewLimitValue] = useState('');
  const [updatingLimitCode, setUpdatingLimitCode] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Fetch all plans
  const fetchPlans = useCallback(async () => {
    setLoading(true);
    try {
      const res = await subscriptionService.getAll({ fetchAll: 'true' });
      const rawList =
        res?.data?.responses ||
        res?.data?.rows ||
        res?.data?.data ||
        (Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []));

      if (Array.isArray(rawList)) {
        setPlans(rawList);
      } else {
        setPlans([]);
      }
    } catch (err) {
      console.warn('Subscription plans API offline, using fallback:', err);
      setPlans([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  // Load all system modules once for reference
  useEffect(() => {
    async function loadAllModules() {
      try {
        const res = await moduleService.getAll({ fetchAll: 'true' });
        const list =
          res?.data?.responses ||
          res?.data?.rows ||
          (Array.isArray(res?.data) ? res.data : []);
        if (Array.isArray(list)) {
          setAllModules(list);
        }
      } catch (err) {
        console.warn('Failed to load system modules for plan mapping:', err);
      }
    }
    loadAllModules();
  }, []);

  // Open Edit / Details Modal by fetching fresh plan by ID
  const handleOpenEdit = async (planId) => {
    setLoadingDetail(true);
    setEditTab('details');
    try {
      const res = await subscriptionService.getById(planId);
      const planData = res?.data || res?.data?.plan || res;

      if (planData && planData.id) {
        setEditingPlan(planData);
        setEditForm({
          name: planData.name || '',
          description: planData.description || '',
          priceMonthly: planData.priceMonthly != null ? planData.priceMonthly : 0,
          priceYearly: planData.priceYearly != null ? planData.priceYearly : 0,
          trialDays: planData.trialDays != null ? planData.trialDays : 0,
          isActive: planData.isActive !== undefined ? Boolean(planData.isActive) : true,
        });
        setPlanModules(Array.isArray(planData.modules) ? planData.modules : []);
        setPlanLimits(Array.isArray(planData.resourceLimits) ? planData.resourceLimits : []);
      } else {
        alert(res?.message || 'Failed to load plan details.');
      }
    } catch (err) {
      alert(err.message || 'Error fetching plan details.');
    } finally {
      setLoadingDetail(false);
    }
  };

  const closeEditModal = () => {
    setEditingPlan(null);
    setEditTab('details');
    setNewLimitValue('');
  };

  // Lock body scroll and close on Escape key when any modal is open
  useEffect(() => {
    const isModalOpen = Boolean(showCreateModal || editingPlan);
    if (!isModalOpen) return undefined;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (showCreateModal) {
          setShowCreateModal(false);
        }
        if (editingPlan) {
          closeEditModal();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showCreateModal, editingPlan]);

  // 1. Create Plan (POST /api/subscription-plan)
  const handleCreatePlan = async (e) => {
    e.preventDefault();
    const name = createForm.name.trim();
    if (!name || name.length < 2 || name.length > 100) {
      alert('Plan name must be between 2 and 100 characters.');
      return;
    }

    setCreating(true);
    const payload = {
      name,
      description: createForm.description.trim() || undefined,
      priceMonthly: parseFloat(createForm.priceMonthly) || 0,
      priceYearly: parseFloat(createForm.priceYearly) || 0,
      trialDays: parseInt(createForm.trialDays, 10) || 0,
      isActive: Boolean(createForm.isActive),
    };

    try {
      const res = await subscriptionService.create(payload);
      if (res && res.success !== false) {
        showToast('Subscription plan created successfully.');
        setShowCreateModal(false);
        setCreateForm(emptyCreateForm);
        fetchPlans();
      } else {
        alert(res?.message || 'Failed to create subscription plan.');
      }
    } catch (err) {
      alert(err.message || 'Error creating subscription plan.');
    } finally {
      setCreating(false);
    }
  };

  // 3. Update Plan Details (PUT /api/subscription-plan/:id)
  const handleUpdatePlanDetails = async (e) => {
    e.preventDefault();
    if (!editingPlan) return;

    const name = editForm.name.trim();
    if (!name || name.length < 2 || name.length > 100) {
      alert('Plan name must be between 2 and 100 characters.');
      return;
    }

    setSavingDetails(true);
    const payload = {
      name,
      description: editForm.description.trim() || undefined,
      priceMonthly: parseFloat(editForm.priceMonthly) || 0,
      priceYearly: parseFloat(editForm.priceYearly) || 0,
      trialDays: parseInt(editForm.trialDays, 10) || 0,
      isActive: Boolean(editForm.isActive),
    };

    try {
      const res = await subscriptionService.update(editingPlan.id, payload);
      if (res && res.success !== false) {
        showToast('Plan details updated successfully.');
        fetchPlans();
      } else {
        alert(res?.message || 'Failed to update plan details.');
      }
    } catch (err) {
      alert(err.message || 'Error updating plan.');
    } finally {
      setSavingDetails(false);
    }
  };

  // 4. Module Assignment (PATCH /api/subscription-plan/:id/module)
  const handleToggleModule = async (moduleId, currentEnabled) => {
    if (!editingPlan) return;
    setTogglingModuleId(moduleId);
    const nextEnable = !currentEnabled;

    try {
      const res = await subscriptionService.updateModule(editingPlan.id, {
        moduleId,
        enable: nextEnable,
      });

      if (res && res.success !== false) {
        setPlanModules((prev) => {
          const exists = prev.find((m) => m.moduleId === moduleId);
          if (exists) {
            return prev.map((m) => (m.moduleId === moduleId ? { ...m, enable: nextEnable } : m));
          }
          const modDef = allModules.find((m) => m.id === moduleId);
          return [...prev, { moduleId, enable: nextEnable, module: modDef }];
        });
        showToast(`Module ${nextEnable ? 'enabled' : 'disabled'} for plan.`);
        fetchPlans();
      } else {
        alert(res?.message || 'Failed to update plan module.');
      }
    } catch (err) {
      alert(err.message || 'Error updating module assignment.');
    } finally {
      setTogglingModuleId(null);
    }
  };

  // 5. Resource Limits (PATCH /api/subscription-plan/:id/resource-limit)
  const handleSetResourceLimit = async (resourceCode, limitVal) => {
    if (!editingPlan) return;
    const cleanCode = String(resourceCode).trim();
    const cleanLimit = parseInt(limitVal, 10);

    if (!cleanCode) {
      alert('Resource code is required.');
      return;
    }
    if (isNaN(cleanLimit) || cleanLimit < 0) {
      alert('Limit must be a non-negative number.');
      return;
    }

    setUpdatingLimitCode(cleanCode);
    try {
      const res = await subscriptionService.updateResourceLimit(editingPlan.id, {
        resourceCode: cleanCode,
        limit: cleanLimit,
      });

      if (res && res.success !== false) {
        setPlanLimits((prev) => {
          const idx = prev.findIndex((l) => l.resourceCode === cleanCode);
          if (idx >= 0) {
            const copy = [...prev];
            copy[idx] = { ...copy[idx], limit: cleanLimit };
            return copy;
          }
          return [...prev, { resourceCode: cleanCode, limit: cleanLimit }];
        });
        showToast(`Limit for ${cleanCode} set to ${cleanLimit}.`);
        setNewLimitValue('');
        fetchPlans();
      } else {
        alert(res?.message || 'Failed to set resource limit.');
      }
    } catch (err) {
      alert(err.message || 'Error updating resource limit.');
    } finally {
      setUpdatingLimitCode(null);
    }
  };

  // Toggle Plan Status (PATCH /api/subscription-plan/:id/status)
  const handleToggleStatus = async (planId, currentStatus) => {
    try {
      const nextStatus = !currentStatus;
      const res = await subscriptionService.updateStatus(planId, nextStatus);
      if (res && res.success !== false) {
        showToast(`Plan ${nextStatus ? 'activated' : 'deactivated'} successfully.`);
        setPlans((prev) =>
          prev.map((plan) => (plan.id === planId ? { ...plan, isActive: nextStatus } : plan))
        );
      } else {
        alert(res?.message || 'Failed to update plan status.');
      }
    } catch (err) {
      console.warn('Status toggle fallback:', err);
    }
  };

  // Delete Plan (DELETE /api/subscription-plan/:id)
  const handleDeletePlan = async (planId) => {
    if (window.confirm('Are you sure you want to delete this subscription plan?')) {
      try {
        const res = await subscriptionService.delete(planId);
        if (res && res.success !== false) {
          showToast('Plan deleted successfully.');
          setPlans((prev) => prev.filter((p) => p.id !== planId));
        } else {
          alert(res?.message || 'Failed to delete plan.');
        }
      } catch (err) {
        console.warn('Delete plan error:', err);
      }
    }
  };

  return (
    <div className={styles.page} data-testid="admin-subscription-page">
      {toastMessage && <div className={styles.toast}>{toastMessage}</div>}

      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Subscription &amp; Plan Management</h1>
          <p className={styles.subtitle}>
            Configure organizational subscription tiers, module permissions, and resource usage limits.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="secondary" onClick={fetchPlans}>
            Refresh Plans
          </Button>
          <Button variant="primary" onClick={() => setShowCreateModal(true)}>
            + Create Plan
          </Button>
        </div>
      </header>

      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
          Loading subscription plans...
        </div>
      ) : plans.length === 0 ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
          No subscription plans found. Click &quot;+ Create Plan&quot; to add one.
        </div>
      ) : (
        <div className={styles.grid}>
          {plans.map((plan) => {
            const isActive = plan.isActive !== false;
            const activeModulesCount = Array.isArray(plan.modules)
              ? plan.modules.filter((m) => m.enable !== false).length
              : 0;

            return (
              <div key={plan.id} className={styles.planCard}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.planTitle}>{plan.name || 'Plan'}</h3>
                  <span className={isActive ? styles.statusActive : styles.statusInactive}>
                    {isActive ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </div>

                <p className={styles.planDescription}>
                  {plan.description || 'No description provided for this plan.'}
                </p>

                <div className={styles.priceBlock}>
                  <span className={styles.priceAmount}>${plan.priceMonthly != null ? plan.priceMonthly : '0'}</span>
                  <span className={styles.priceDuration}> / Month</span>
                  {plan.priceYearly != null && Number(plan.priceYearly) > 0 && (
                    <span className={styles.priceYearly}>
                      (${plan.priceYearly}/yr)
                    </span>
                  )}
                </div>

                <div className={styles.metaRow}>
                  {plan.trialDays ? (
                    <span className={styles.badgePrimary}>{plan.trialDays} Days Trial</span>
                  ) : null}
                  <span className={styles.badge}>{activeModulesCount} Modules Active</span>
                  {Array.isArray(plan.resourceLimits) && plan.resourceLimits.length > 0 && (
                    <span className={styles.badge}>{plan.resourceLimits.length} Limits Set</span>
                  )}
                </div>

                <div
                  className={styles.limitsBlock}
                  title={
                    Array.isArray(plan.resourceLimits) && plan.resourceLimits.length > 0
                      ? plan.resourceLimits.map((l) => `${l.resourceCode}: ${l.limit}`).join(', ')
                      : 'Standard limits apply'
                  }
                >
                  {Array.isArray(plan.resourceLimits) && plan.resourceLimits.length > 0 ? (
                    <>
                      <strong>Limits: </strong>
                      {plan.resourceLimits.map((l) => `${l.resourceCode}: ${l.limit}`).join(', ')}
                    </>
                  ) : (
                    <span className={styles.noLimits}>Standard limits apply</span>
                  )}
                </div>

                <div className={styles.cardFooter}>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleOpenEdit(plan.id)}
                  >
                    Manage / Edit
                  </Button>
                  <Button
                    variant={isActive ? 'secondary' : 'primary'}
                    size="sm"
                    onClick={() => handleToggleStatus(plan.id, isActive)}
                  >
                    {isActive ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeletePlan(plan.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE PLAN MODAL (POST /api/subscription-plan) */}
      {showCreateModal && (
        <div className={styles.modalOverlay} onClick={() => setShowCreateModal(false)}>
          <form
            className={styles.modalForm}
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleCreatePlan}
          >
            <h2 className={styles.modalTitle}>Create Subscription Plan</h2>

            <label className={styles.fieldLabel}>
              Plan Name *
              <input
                required
                type="text"
                minLength={2}
                maxLength={100}
                className={styles.inputField}
                value={createForm.name}
                onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                placeholder="e.g. Enterprise Tier"
              />
            </label>

            <label className={styles.fieldLabel}>
              Description
              <textarea
                className={styles.textareaField}
                value={createForm.description}
                onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                placeholder="Description of the plan scope..."
                rows={2}
              />
            </label>

            <div className={styles.fieldRow}>
              <label className={styles.fieldLabel}>
                Monthly Price ($) *
                <input
                  required
                  type="number"
                  min="0"
                  step="any"
                  className={styles.inputField}
                  value={createForm.priceMonthly}
                  onChange={(e) => setCreateForm({ ...createForm, priceMonthly: e.target.value })}
                  placeholder="49"
                />
              </label>

              <label className={styles.fieldLabel}>
                Yearly Price ($)
                <input
                  type="number"
                  min="0"
                  step="any"
                  className={styles.inputField}
                  value={createForm.priceYearly}
                  onChange={(e) => setCreateForm({ ...createForm, priceYearly: e.target.value })}
                  placeholder="490"
                />
              </label>
            </div>

            <div className={styles.fieldRow}>
              <label className={styles.fieldLabel}>
                Trial Days
                <input
                  type="number"
                  min="0"
                  className={styles.inputField}
                  value={createForm.trialDays}
                  onChange={(e) => setCreateForm({ ...createForm, trialDays: e.target.value })}
                  placeholder="14"
                />
              </label>

              <label className={styles.fieldLabel} style={{ justifyContent: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.25rem' }}>
                  <input
                    type="checkbox"
                    checked={createForm.isActive}
                    onChange={(e) => setCreateForm({ ...createForm, isActive: e.target.checked })}
                  />
                  Plan is Active
                </span>
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
              <Button type="button" variant="secondary" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={creating}>
                {creating ? 'Creating...' : 'Create Plan'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* EDIT / MANAGE PLAN MODAL (GET :id, PUT :id, PATCH module, PATCH resource-limit) */}
      {editingPlan && (
        <div className={styles.modalOverlay} onClick={closeEditModal}>
          <div
            className={`${styles.modalForm} ${styles.modalWide}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.sectionHeader}>
              <div>
                <h2 className={styles.modalTitle}>Manage Plan: {editingPlan.name}</h2>
                <small style={{ color: 'var(--color-text-secondary)' }}>ID: {editingPlan.id}</small>
              </div>
              <button
                type="button"
                onClick={closeEditModal}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--color-text-secondary)' }}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {loadingDetail ? (
              <div className={styles.tabLoading}>Loading fresh plan details...</div>
            ) : (
              <div className={styles.tabContentArea}>
                {/* Modal Navigation Tabs */}
                <div className={styles.modalTabs}>
                  <button
                    type="button"
                    className={`${styles.modalTab} ${editTab === 'details' ? styles.modalTabActive : ''}`}
                    onClick={() => setEditTab('details')}
                  >
                    1. Plan Details (PUT)
                  </button>
                  <button
                    type="button"
                    className={`${styles.modalTab} ${editTab === 'modules' ? styles.modalTabActive : ''}`}
                    onClick={() => setEditTab('modules')}
                  >
                    2. Modules (PATCH)
                  </button>
                  <button
                    type="button"
                    className={`${styles.modalTab} ${editTab === 'limits' ? styles.modalTabActive : ''}`}
                    onClick={() => setEditTab('limits')}
                  >
                    3. Resource Limits (PATCH)
                  </button>
                </div>

                {/* TAB 1: BASIC DETAILS */}
                {editTab === 'details' && (
                  <form onSubmit={handleUpdatePlanDetails} className={styles.tabPanelForm}>
                    <div className={styles.tabFormScrollArea}>
                      <label className={styles.fieldLabel}>
                        Plan Name *
                        <input
                          required
                          type="text"
                          minLength={2}
                          maxLength={100}
                          className={styles.inputField}
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        />
                      </label>

                      <label className={styles.fieldLabel}>
                        Description
                        <textarea
                          className={styles.textareaField}
                          value={editForm.description}
                          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                          rows={2}
                        />
                      </label>

                      <div className={styles.fieldRow}>
                        <label className={styles.fieldLabel}>
                          Monthly Price ($) *
                          <input
                            required
                            type="number"
                            min="0"
                            step="any"
                            className={styles.inputField}
                            value={editForm.priceMonthly}
                            onChange={(e) => setEditForm({ ...editForm, priceMonthly: e.target.value })}
                          />
                        </label>

                        <label className={styles.fieldLabel}>
                          Yearly Price ($)
                          <input
                            type="number"
                            min="0"
                            step="any"
                            className={styles.inputField}
                            value={editForm.priceYearly}
                            onChange={(e) => setEditForm({ ...editForm, priceYearly: e.target.value })}
                          />
                        </label>
                      </div>

                      <div className={styles.fieldRow}>
                        <label className={styles.fieldLabel}>
                          Trial Days
                          <input
                            type="number"
                            min="0"
                            className={styles.inputField}
                            value={editForm.trialDays}
                            onChange={(e) => setEditForm({ ...editForm, trialDays: e.target.value })}
                          />
                        </label>

                        <label className={styles.fieldLabel} style={{ justifyContent: 'center' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.25rem' }}>
                            <input
                              type="checkbox"
                              checked={editForm.isActive}
                              onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })}
                            />
                            Plan is Active
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className={styles.tabFooter}>
                      <Button type="button" variant="secondary" onClick={closeEditModal}>
                        Close
                      </Button>
                      <Button type="submit" variant="primary" disabled={savingDetails}>
                        {savingDetails ? 'Saving...' : 'Save Plan Details'}
                      </Button>
                    </div>
                  </form>
                )}

                {/* TAB 2: MODULE ASSIGNMENT (PATCH /:id/module) */}
                {editTab === 'modules' && (
                  <div className={styles.tabPanel}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                      Toggle which system modules are active for subscribers on this plan. Changes take effect immediately via <code>PATCH /api/subscription-plan/:id/module</code>.
                    </div>

                    <div className={styles.moduleList}>
                      {allModules.length === 0 ? (
                        <div style={{ textAlign: 'center', color: 'var(--color-text-secondary)', padding: '1rem' }}>
                          No system modules found.
                        </div>
                      ) : (
                        allModules.map((mod) => {
                          const assigned = planModules.find((pm) => pm.moduleId === mod.id);
                          const isEnabled = assigned ? assigned.enable !== false : false;
                          const isPending = togglingModuleId === mod.id;

                          return (
                            <div key={mod.id} className={styles.moduleItem}>
                              <div className={styles.moduleItemInfo}>
                                <span className={styles.moduleItemName}>{mod.name}</span>
                                {mod.description && (
                                  <span className={styles.moduleItemDesc}>{mod.description}</span>
                                )}
                              </div>
                              <Button
                                variant={isEnabled ? 'primary' : 'secondary'}
                                size="sm"
                                disabled={isPending}
                                onClick={() => handleToggleModule(mod.id, isEnabled)}
                                style={{ minWidth: '85px' }}
                              >
                                {isPending ? 'Updating...' : isEnabled ? 'Enabled' : 'Disabled'}
                              </Button>
                            </div>
                          );
                        })
                      )}
                    </div>

                    <div className={styles.tabFooter}>
                      <Button type="button" variant="secondary" onClick={closeEditModal}>
                        Done
                      </Button>
                    </div>
                  </div>
                )}

                {/* TAB 3: RESOURCE LIMITS (PATCH /:id/resource-limit) */}
                {editTab === 'limits' && (
                  <div className={styles.tabPanel}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                      Manage numerical caps (e.g. users, rooms, storage). Persisted via <code>PATCH /api/subscription-plan/:id/resource-limit</code>.
                    </div>

                    <div className={styles.limitList}>
                      {planLimits.length === 0 ? (
                        <div style={{ textAlign: 'center', color: 'var(--color-text-secondary)', padding: '1rem' }}>
                          No resource limits configured for this plan yet.
                        </div>
                      ) : (
                        planLimits.map((lim) => {
                          const isUpdating = updatingLimitCode === lim.resourceCode;

                          return (
                            <div key={lim.resourceCode} className={styles.limitItem}>
                              <span className={styles.limitCode}>{lim.resourceCode}</span>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <input
                                  type="number"
                                  min="0"
                                  className={styles.limitInput}
                                  defaultValue={lim.limit}
                                  id={`input-limit-${lim.resourceCode}`}
                                />
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  disabled={isUpdating}
                                  onClick={() => {
                                    const input = document.getElementById(`input-limit-${lim.resourceCode}`);
                                    if (input) {
                                      handleSetResourceLimit(lim.resourceCode, input.value);
                                    }
                                  }}
                                >
                                  {isUpdating ? 'Saving...' : 'Update'}
                                </Button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Add / Set new Resource Limit */}
                    <div className={styles.limitAddBox}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>+ Add or Set Resource Limit</span>
                      <div className={styles.limitAddRow}>
                        <select
                          className={styles.selectField}
                          value={newLimitCode}
                          onChange={(e) => setNewLimitCode(e.target.value)}
                        >
                          {DEFAULT_RESOURCE_CODES.map((code) => (
                            <option key={code} value={code}>
                              {code}
                            </option>
                          ))}
                        </select>
                        <input
                          type="number"
                          min="0"
                          className={styles.inputField}
                          placeholder="Limit (e.g. 50)"
                          value={newLimitValue}
                          onChange={(e) => setNewLimitValue(e.target.value)}
                        />
                        <Button
                          variant="primary"
                          size="sm"
                          disabled={!newLimitValue || updatingLimitCode === newLimitCode}
                          onClick={() => handleSetResourceLimit(newLimitCode, newLimitValue)}
                        >
                          Set Limit
                        </Button>
                      </div>
                    </div>

                    <div className={styles.tabFooter}>
                      <Button type="button" variant="secondary" onClick={closeEditModal}>
                        Done
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
