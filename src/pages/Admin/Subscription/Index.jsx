/**
 * @file Admin/Subscription/Index.jsx
 * @description Organization subscription plan definitions, tier limits, module assignment,
 * and organizational active subscription bindings.
 * Bound to `subscriptionService`, `organizationSubscriptionService`, `organizationService`, and `moduleService`.
 */
import React, { useCallback, useEffect, useState } from 'react';
import Button from '@components/Button/Button';
import { subscriptionService } from '@services/subscriptionService';
import organizationSubscriptionService from '@services/organizationSubscriptionService';
import organizationService from '@services/organizationService';
import moduleService from '@services/moduleService';
import styles from './Index.module.css';

const DEFAULT_RESOURCE_CODES = [
  'MAX_USERS',
  'MAX_STORAGE_GB',
  'MAX_ROOMS',
  'MAX_BRANCHES',
];

const SUBSCRIPTION_STATUS_OPTIONS = [
  { value: 'trial', label: 'Trial' },
  { value: 'active', label: 'Active' },
  { value: 'expired', label: 'Expired' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'suspended', label: 'Suspended' },
];

const emptyCreatePlanForm = {
  name: '',
  description: '',
  priceMonthly: '',
  priceYearly: '',
  trialDays: 14,
  isActive: true,
};

const emptyAssignSubForm = {
  organizationId: '',
  subscriptionPlanId: '',
  status: 'trial',
  startDate: new Date().toISOString().split('T')[0],
  endDate: '',
};

export default function AdminSubscriptionPage() {
  // Top-level tabs: 'plans' | 'orgSubscriptions'
  const [activeMainTab, setActiveMainTab] = useState('plans');
  const [toastMessage, setToastMessage] = useState('');

  // ==========================================
  // 1. SUBSCRIPTION PLANS STATE & LOGIC
  // ==========================================
  const [plans, setPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);

  // Create Plan Modal
  const [showCreatePlanModal, setShowCreatePlanModal] = useState(false);
  const [createPlanForm, setCreatePlanForm] = useState(emptyCreatePlanForm);
  const [creatingPlan, setCreatingPlan] = useState(false);

  // Edit / Manage Plan Modal
  const [editingPlan, setEditingPlan] = useState(null);
  const [loadingPlanDetail, setLoadingPlanDetail] = useState(false);
  const [editPlanTab, setEditPlanTab] = useState('details'); // 'details' | 'modules' | 'limits'
  const [editPlanForm, setEditPlanForm] = useState({
    name: '',
    description: '',
    priceMonthly: 0,
    priceYearly: 0,
    trialDays: 0,
    isActive: true,
  });
  const [savingPlanDetails, setSavingPlanDetails] = useState(false);

  // Plan Modules & Resource Limits
  const [allModules, setAllModules] = useState([]);
  const [planModules, setPlanModules] = useState([]);
  const [planLimits, setPlanLimits] = useState([]);
  const [togglingModuleId, setTogglingModuleId] = useState(null);

  // Limit inputs
  const [newLimitCode, setNewLimitCode] = useState('MAX_USERS');
  const [newLimitValue, setNewLimitValue] = useState('');
  const [updatingLimitCode, setUpdatingLimitCode] = useState(null);

  // ==========================================
  // 2. ORGANIZATION SUBSCRIPTIONS STATE & LOGIC
  // ==========================================
  const [orgSubscriptions, setOrgSubscriptions] = useState([]);
  const [loadingOrgSubs, setLoadingOrgSubs] = useState(false);
  const [orgSubsSearch, setOrgSubsSearch] = useState('');
  const [debouncedOrgSubsSearch, setDebouncedOrgSubsSearch] = useState('');
  const [orgSubsStatusFilter, setOrgSubsStatusFilter] = useState('all');
  const [orgSubsPage, setOrgSubsPage] = useState(1);
  const [orgSubsLimit] = useState(10);
  const [orgSubsTotal, setOrgSubsTotal] = useState(0);
  const [orgSubsTotalPages, setOrgSubsTotalPages] = useState(1);

  // Dropdown reference lists
  const [orgList, setOrgList] = useState([]);
  const [planDropdownList, setPlanDropdownList] = useState([]);

  // Assign Subscription Modal
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignForm, setAssignForm] = useState(emptyAssignSubForm);
  const [assigning, setAssigning] = useState(false);

  // Edit Subscription Modal
  const [editingOrgSub, setEditingOrgSub] = useState(null);
  const [loadingEditOrgSub, setLoadingEditOrgSub] = useState(false);
  const [editOrgSubForm, setEditOrgSubForm] = useState({
    subscriptionPlanId: '',
    status: 'active',
    startDate: '',
    endDate: '',
  });
  const [savingEditOrgSub, setSavingEditOrgSub] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // ==========================================
  // DATA FETCHING: PLANS & MODULES
  // ==========================================
  const fetchPlans = useCallback(async () => {
    setLoadingPlans(true);
    try {
      const res = await subscriptionService.getAll({ fetchAll: 'true' });
      const rawList =
        res?.data?.responses ||
        res?.data?.rows ||
        res?.data?.data ||
        (Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []));

      if (Array.isArray(rawList)) {
        setPlans(rawList);
        setPlanDropdownList(rawList);
      } else {
        setPlans([]);
        setPlanDropdownList([]);
      }
    } catch (err) {
      console.warn('Subscription plans API fallback:', err);
      setPlans([]);
    } finally {
      setLoadingPlans(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

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

  // Load organizations for dropdown
  const loadOrganizations = useCallback(async () => {
    try {
      const res = await organizationService.getAll({ fetchAll: 'true' });
      const list =
        res?.data?.responses ||
        res?.data?.rows ||
        res?.data?.data ||
        (Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []));
      if (Array.isArray(list)) {
        setOrgList(list);
      }
    } catch (err) {
      console.warn('Failed to load organizations dropdown:', err);
    }
  }, []);

  // 300ms debounce for Organization Subscriptions search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedOrgSubsSearch(orgSubsSearch.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [orgSubsSearch]);

  // ==========================================
  // DATA FETCHING: ORGANIZATION SUBSCRIPTIONS
  // ==========================================
  const fetchOrgSubscriptions = useCallback(async () => {
    setLoadingOrgSubs(true);
    try {
      if (debouncedOrgSubsSearch) {
        // Search mode: fetch all records (with status filter if active), do NOT send broken backend search param, filter client-side
        const params = {
          fetchAll: 'true',
        };

        if (orgSubsStatusFilter && orgSubsStatusFilter !== 'all') {
          params.status = orgSubsStatusFilter;
        }

        const res = await organizationSubscriptionService.getAll(params);
        if (res && res.success !== false) {
          const responseData = res.data || {};
          const allRows =
            responseData.responses ||
            responseData.rows ||
            responseData.data ||
            (Array.isArray(res.data) ? res.data : []);

          const query = debouncedOrgSubsSearch.toLowerCase();
          const filtered = allRows.filter((sub) => {
            const orgName = (sub.organizationData?.name || sub.organization?.name || '').toLowerCase();
            const planName = (sub.subscriptionPlanData?.name || sub.subscriptionPlan?.name || '').toLowerCase();
            const status = (sub.status || '').toLowerCase();
            return orgName.includes(query) || planName.includes(query) || status.includes(query);
          });

          const totalFiltered = filtered.length;
          const totalPages = Math.max(1, Math.ceil(totalFiltered / orgSubsLimit));
          const startIndex = (orgSubsPage - 1) * orgSubsLimit;
          const paginatedRows = filtered.slice(startIndex, startIndex + orgSubsLimit);

          setOrgSubscriptions(paginatedRows);
          setOrgSubsTotal(totalFiltered);
          setOrgSubsTotalPages(totalPages);
        } else {
          setOrgSubscriptions([]);
          setOrgSubsTotal(0);
          setOrgSubsTotalPages(1);
        }
      } else {
        // Normal mode: server-side pagination with page, limit, and status
        const params = {
          page: orgSubsPage,
          limit: orgSubsLimit,
        };

        if (orgSubsStatusFilter && orgSubsStatusFilter !== 'all') {
          params.status = orgSubsStatusFilter;
        }

        const res = await organizationSubscriptionService.getAll(params);
        if (res && res.success !== false) {
          const responseData = res.data || {};
          const rows =
            responseData.responses ||
            responseData.rows ||
            responseData.data ||
            (Array.isArray(res.data) ? res.data : []);
          setOrgSubscriptions(Array.isArray(rows) ? rows : []);
          setOrgSubsTotal(responseData.totalCount || rows.length || 0);
          setOrgSubsTotalPages(
            responseData.totalPages ||
              Math.max(1, Math.ceil((responseData.totalCount || rows.length || 0) / orgSubsLimit))
          );
        } else {
          setOrgSubscriptions([]);
          setOrgSubsTotal(0);
          setOrgSubsTotalPages(1);
        }
      }
    } catch (err) {
      console.warn('Error fetching organization subscriptions:', err);
      setOrgSubscriptions([]);
      setOrgSubsTotal(0);
      setOrgSubsTotalPages(1);
    } finally {
      setLoadingOrgSubs(false);
    }
  }, [orgSubsPage, orgSubsLimit, debouncedOrgSubsSearch, orgSubsStatusFilter]);

  useEffect(() => {
    if (activeMainTab === 'orgSubscriptions') {
      fetchOrgSubscriptions();
      loadOrganizations();
    }
  }, [activeMainTab, fetchOrgSubscriptions, loadOrganizations]);

  // ==========================================
  // MODAL KEYBOARD & SCROLL LOCK
  // ==========================================
  const closeEditPlanModal = () => {
    setEditingPlan(null);
    setEditPlanTab('details');
    setNewLimitValue('');
  };

  const closeEditOrgSubModal = () => {
    setEditingOrgSub(null);
  };

  useEffect(() => {
    const isModalOpen = Boolean(
      showCreatePlanModal || editingPlan || showAssignModal || editingOrgSub
    );

    if (!isModalOpen) return undefined;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (showCreatePlanModal) setShowCreatePlanModal(false);
        if (editingPlan) closeEditPlanModal();
        if (showAssignModal) setShowAssignModal(false);
        if (editingOrgSub) closeEditOrgSubModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showCreatePlanModal, editingPlan, showAssignModal, editingOrgSub]);

  // ==========================================
  // SUBSCRIPTION PLAN HANDLERS
  // ==========================================
  const handleOpenEditPlan = async (planId) => {
    setLoadingPlanDetail(true);
    setEditPlanTab('details');
    try {
      const res = await subscriptionService.getById(planId);
      const planData = res?.data || res?.data?.plan || res;

      if (planData && planData.id) {
        setEditingPlan(planData);
        setEditPlanForm({
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
      setLoadingPlanDetail(false);
    }
  };

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    const name = createPlanForm.name.trim();
    if (!name || name.length < 2 || name.length > 100) {
      alert('Plan name must be between 2 and 100 characters.');
      return;
    }

    setCreatingPlan(true);
    const payload = {
      name,
      description: createPlanForm.description.trim() || undefined,
      priceMonthly: parseFloat(createPlanForm.priceMonthly) || 0,
      priceYearly: parseFloat(createPlanForm.priceYearly) || 0,
      trialDays: parseInt(createPlanForm.trialDays, 10) || 0,
      isActive: Boolean(createPlanForm.isActive),
    };

    try {
      const res = await subscriptionService.create(payload);
      if (res && res.success !== false) {
        showToast('Subscription plan created successfully.');
        setShowCreatePlanModal(false);
        setCreatePlanForm(emptyCreatePlanForm);
        fetchPlans();
      } else {
        alert(res?.message || 'Failed to create subscription plan.');
      }
    } catch (err) {
      alert(err.message || 'Error creating subscription plan.');
    } finally {
      setCreatingPlan(false);
    }
  };

  const handleUpdatePlanDetails = async (e) => {
    e.preventDefault();
    if (!editingPlan) return;

    const name = editPlanForm.name.trim();
    if (!name || name.length < 2 || name.length > 100) {
      alert('Plan name must be between 2 and 100 characters.');
      return;
    }

    setSavingPlanDetails(true);
    const payload = {
      name,
      description: editPlanForm.description.trim() || undefined,
      priceMonthly: parseFloat(editPlanForm.priceMonthly) || 0,
      priceYearly: parseFloat(editPlanForm.priceYearly) || 0,
      trialDays: parseInt(editPlanForm.trialDays, 10) || 0,
      isActive: Boolean(editPlanForm.isActive),
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
      setSavingPlanDetails(false);
    }
  };

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

  const handleTogglePlanStatus = async (planId, currentStatus) => {
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

  // ==========================================
  // ORGANIZATION SUBSCRIPTION HANDLERS
  // ==========================================
  const handleOpenAssignModal = () => {
    setAssignForm({
      organizationId: orgList[0]?.id || '',
      subscriptionPlanId: planDropdownList[0]?.id || '',
      status: 'trial',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
    });
    setShowAssignModal(true);
  };

  const handleAssignSubscription = async (e) => {
    e.preventDefault();
    if (!assignForm.organizationId) {
      alert('Organization is required.');
      return;
    }
    if (!assignForm.subscriptionPlanId) {
      alert('Subscription Plan is required.');
      return;
    }
    if (!assignForm.startDate) {
      alert('Start date is required.');
      return;
    }
    if (assignForm.endDate && new Date(assignForm.endDate) < new Date(assignForm.startDate)) {
      alert('End date cannot be earlier than start date.');
      return;
    }

    setAssigning(true);
    try {
      const payload = {
        organizationId: assignForm.organizationId,
        subscriptionPlanId: assignForm.subscriptionPlanId,
        status: assignForm.status,
        startDate: new Date(assignForm.startDate).toISOString(),
        endDate: assignForm.endDate ? new Date(assignForm.endDate).toISOString() : undefined,
      };

      const res = await organizationSubscriptionService.create(payload);
      if (res && res.success !== false) {
        showToast('Subscription assigned to organization successfully.');
        setShowAssignModal(false);
        fetchOrgSubscriptions();
      } else {
        alert(res?.message || 'Failed to assign subscription.');
      }
    } catch (err) {
      alert(err.message || 'Error assigning subscription.');
    } finally {
      setAssigning(false);
    }
  };

  const handleOpenEditOrgSub = async (subId) => {
    setLoadingEditOrgSub(true);
    try {
      const res = await organizationSubscriptionService.getById(subId);
      const subData = res?.data || res;

      if (subData && subData.id) {
        setEditingOrgSub(subData);
        setEditOrgSubForm({
          subscriptionPlanId: subData.subscriptionPlanId || '',
          status: subData.status || 'active',
          startDate: subData.startDate ? new Date(subData.startDate).toISOString().split('T')[0] : '',
          endDate: subData.endDate ? new Date(subData.endDate).toISOString().split('T')[0] : '',
        });
      } else {
        alert(res?.message || 'Failed to load subscription details.');
      }
    } catch (err) {
      alert(err.message || 'Error fetching subscription details.');
    } finally {
      setLoadingEditOrgSub(false);
    }
  };

  const handleUpdateOrgSub = async (e) => {
    e.preventDefault();
    if (!editingOrgSub) return;

    if (editOrgSubForm.startDate && editOrgSubForm.endDate && new Date(editOrgSubForm.endDate) < new Date(editOrgSubForm.startDate)) {
      alert('End date cannot be earlier than start date.');
      return;
    }

    setSavingEditOrgSub(true);
    try {
      const payload = {
        subscriptionPlanId: editOrgSubForm.subscriptionPlanId,
        status: editOrgSubForm.status,
        startDate: editOrgSubForm.startDate ? new Date(editOrgSubForm.startDate).toISOString() : undefined,
        endDate: editOrgSubForm.endDate ? new Date(editOrgSubForm.endDate).toISOString() : undefined,
      };

      const res = await organizationSubscriptionService.update(editingOrgSub.id, payload);
      if (res && res.success !== false) {
        showToast('Organization subscription updated successfully.');
        closeEditOrgSubModal();
        fetchOrgSubscriptions();
      } else {
        alert(res?.message || 'Failed to update organization subscription.');
      }
    } catch (err) {
      alert(err.message || 'Error updating subscription.');
    } finally {
      setSavingEditOrgSub(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    const s = String(status).toLowerCase();
    if (s === 'active') return styles.statusActive;
    if (s === 'trial') return styles.statusTrial;
    if (s === 'expired') return styles.statusExpired;
    if (s === 'cancelled') return styles.statusCancelled;
    if (s === 'suspended') return styles.statusSuspended;
    return styles.badge;
  };

  return (
    <div className={styles.page} data-testid="admin-subscription-page">
      {toastMessage && <div className={styles.toast}>{toastMessage}</div>}

      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>
            {activeMainTab === 'plans' ? 'Subscription & Plan Management' : 'Organization Subscriptions'}
          </h1>
          <p className={styles.subtitle}>
            {activeMainTab === 'plans'
              ? 'Configure organizational subscription tiers, module permissions, and resource usage limits.'
              : 'Manage customer property subscription assignments, billing terms, and active lifecycles.'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {activeMainTab === 'plans' ? (
            <>
              <Button variant="secondary" onClick={fetchPlans}>
                Refresh Plans
              </Button>
              <Button variant="primary" onClick={() => setShowCreatePlanModal(true)}>
                + Create Plan
              </Button>
            </>
          ) : (
            <>
              <Button variant="secondary" onClick={fetchOrgSubscriptions}>
                Refresh List
              </Button>
              <Button variant="primary" onClick={handleOpenAssignModal}>
                + Assign Subscription
              </Button>
            </>
          )}
        </div>
      </header>

      {/* Top-Level Page Navigation Tabs */}
      <nav className={styles.mainTabs} aria-label="Subscription Navigation">
        <button
          type="button"
          className={`${styles.mainTab} ${activeMainTab === 'plans' ? styles.mainTabActive : ''}`}
          onClick={() => setActiveMainTab('plans')}
        >
          Subscription Plans
        </button>
        <button
          type="button"
          className={`${styles.mainTab} ${activeMainTab === 'orgSubscriptions' ? styles.mainTabActive : ''}`}
          onClick={() => setActiveMainTab('orgSubscriptions')}
        >
          Organization Subscriptions
        </button>
      </nav>

      {/* TAB 1: SUBSCRIPTION PLANS */}
      {activeMainTab === 'plans' && (
        <>
          {loadingPlans ? (
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
                        onClick={() => handleOpenEditPlan(plan.id)}
                      >
                        Manage / Edit
                      </Button>
                      <Button
                        variant={isActive ? 'secondary' : 'primary'}
                        size="sm"
                        onClick={() => handleTogglePlanStatus(plan.id, isActive)}
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
        </>
      )}

      {/* TAB 2: ORGANIZATION SUBSCRIPTIONS */}
      {activeMainTab === 'orgSubscriptions' && (
        <section className={styles.card}>
          <div className={styles.toolbar}>
            <div className={styles.searchWrap}>
              <span className={styles.searchIcon}>⌕</span>
              <input
                type="search"
                value={orgSubsSearch}
                onChange={(e) => {
                  setOrgSubsSearch(e.target.value);
                  setOrgSubsPage(1);
                }}
                placeholder="Search by organization, plan, or status..."
                aria-label="Search subscriptions"
              />
            </div>

            <select
              value={orgSubsStatusFilter}
              onChange={(e) => {
                setOrgSubsStatusFilter(e.target.value);
                setOrgSubsPage(1);
              }}
              className={styles.statusSelect}
              aria-label="Filter by subscription status"
            >
              <option value="all">All Statuses</option>
              <option value="trial">Trial</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="cancelled">Cancelled</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Organization</th>
                  <th>Subscription Plan</th>
                  <th>Status</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th aria-label="Actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loadingOrgSubs ? (
                  <tr>
                    <td colSpan="6">
                      <div className={styles.loadingState}>Loading organization subscriptions...</div>
                    </td>
                  </tr>
                ) : orgSubscriptions.length === 0 ? (
                  <tr>
                    <td colSpan="6">
                      <div className={styles.emptyState}>
                        No organization subscriptions found. Click &quot;+ Assign Subscription&quot; to add one.
                      </div>
                    </td>
                  </tr>
                ) : (
                  orgSubscriptions.map((sub) => {
                    const orgName = sub.organizationData?.name || sub.organization?.name || 'Unassigned Org';
                    const planName = sub.subscriptionPlanData?.name || sub.subscriptionPlan?.name || 'Custom Plan';
                    const statusText = sub.status ? sub.status.toUpperCase() : 'UNKNOWN';

                    return (
                      <tr key={sub.id}>
                        <td>
                          <strong>{orgName}</strong>
                        </td>
                        <td>{planName}</td>
                        <td>
                          <span className={getStatusBadgeClass(sub.status)}>
                            {statusText}
                          </span>
                        </td>
                        <td>{sub.startDate ? new Date(sub.startDate).toLocaleDateString() : '—'}</td>
                        <td>{sub.endDate ? new Date(sub.endDate).toLocaleDateString() : 'No expiry'}</td>
                        <td>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleOpenEditOrgSub(sub.id)}
                          >
                            Edit
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {!loadingOrgSubs && orgSubsTotal > 0 && (
            <div className={styles.tableFooter}>
              <span>
                Showing {orgSubscriptions.length} of {orgSubsTotal} subscriptions (Page {orgSubsPage} of {orgSubsTotalPages})
              </span>

              <div className={styles.paginationBtns}>
                <button
                  type="button"
                  disabled={orgSubsPage <= 1}
                  onClick={() => setOrgSubsPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </button>
                <span className={styles.pageNumber}>{orgSubsPage}</span>
                <button
                  type="button"
                  disabled={orgSubsPage >= orgSubsTotalPages}
                  onClick={() => setOrgSubsPage((p) => Math.min(orgSubsTotalPages, p + 1))}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {/* CREATE PLAN MODAL (POST /api/subscription-plan) */}
      {showCreatePlanModal && (
        <div className={styles.modalOverlay} onClick={() => setShowCreatePlanModal(false)}>
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
                value={createPlanForm.name}
                onChange={(e) => setCreatePlanForm({ ...createPlanForm, name: e.target.value })}
                placeholder="e.g. Enterprise Tier"
              />
            </label>

            <label className={styles.fieldLabel}>
              Description
              <textarea
                className={styles.textareaField}
                value={createPlanForm.description}
                onChange={(e) => setCreatePlanForm({ ...createPlanForm, description: e.target.value })}
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
                  value={createPlanForm.priceMonthly}
                  onChange={(e) => setCreatePlanForm({ ...createPlanForm, priceMonthly: e.target.value })}
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
                  value={createPlanForm.priceYearly}
                  onChange={(e) => setCreatePlanForm({ ...createPlanForm, priceYearly: e.target.value })}
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
                  value={createPlanForm.trialDays}
                  onChange={(e) => setCreatePlanForm({ ...createPlanForm, trialDays: e.target.value })}
                  placeholder="14"
                />
              </label>

              <label className={styles.fieldLabel} style={{ justifyContent: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.25rem' }}>
                  <input
                    type="checkbox"
                    checked={createPlanForm.isActive}
                    onChange={(e) => setCreatePlanForm({ ...createPlanForm, isActive: e.target.checked })}
                  />
                  Plan is Active
                </span>
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
              <Button type="button" variant="secondary" onClick={() => setShowCreatePlanModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={creatingPlan}>
                {creatingPlan ? 'Creating...' : 'Create Plan'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* EDIT / MANAGE PLAN MODAL (GET :id, PUT :id, PATCH module, PATCH resource-limit) */}
      {editingPlan && (
        <div className={styles.modalOverlay} onClick={closeEditPlanModal}>
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
                onClick={closeEditPlanModal}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--color-text-secondary)' }}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {loadingPlanDetail ? (
              <div className={styles.tabLoading}>Loading fresh plan details...</div>
            ) : (
              <div className={styles.tabContentArea}>
                {/* Modal Navigation Tabs */}
                <div className={styles.modalTabs}>
                  <button
                    type="button"
                    className={`${styles.modalTab} ${editPlanTab === 'details' ? styles.modalTabActive : ''}`}
                    onClick={() => setEditPlanTab('details')}
                  >
                    1. Plan Details (PUT)
                  </button>
                  <button
                    type="button"
                    className={`${styles.modalTab} ${editPlanTab === 'modules' ? styles.modalTabActive : ''}`}
                    onClick={() => setEditPlanTab('modules')}
                  >
                    2. Modules (PATCH)
                  </button>
                  <button
                    type="button"
                    className={`${styles.modalTab} ${editPlanTab === 'limits' ? styles.modalTabActive : ''}`}
                    onClick={() => setEditPlanTab('limits')}
                  >
                    3. Resource Limits (PATCH)
                  </button>
                </div>

                {/* TAB 1: BASIC DETAILS */}
                {editPlanTab === 'details' && (
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
                          value={editPlanForm.name}
                          onChange={(e) => setEditPlanForm({ ...editPlanForm, name: e.target.value })}
                        />
                      </label>

                      <label className={styles.fieldLabel}>
                        Description
                        <textarea
                          className={styles.textareaField}
                          value={editPlanForm.description}
                          onChange={(e) => setEditPlanForm({ ...editPlanForm, description: e.target.value })}
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
                            value={editPlanForm.priceMonthly}
                            onChange={(e) => setEditPlanForm({ ...editPlanForm, priceMonthly: e.target.value })}
                          />
                        </label>

                        <label className={styles.fieldLabel}>
                          Yearly Price ($)
                          <input
                            type="number"
                            min="0"
                            step="any"
                            className={styles.inputField}
                            value={editPlanForm.priceYearly}
                            onChange={(e) => setEditPlanForm({ ...editPlanForm, priceYearly: e.target.value })}
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
                            value={editPlanForm.trialDays}
                            onChange={(e) => setEditPlanForm({ ...editPlanForm, trialDays: e.target.value })}
                          />
                        </label>

                        <label className={styles.fieldLabel} style={{ justifyContent: 'center' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.25rem' }}>
                            <input
                              type="checkbox"
                              checked={editPlanForm.isActive}
                              onChange={(e) => setEditPlanForm({ ...editPlanForm, isActive: e.target.checked })}
                            />
                            Plan is Active
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className={styles.tabFooter}>
                      <Button type="button" variant="secondary" onClick={closeEditPlanModal}>
                        Close
                      </Button>
                      <Button type="submit" variant="primary" disabled={savingPlanDetails}>
                        {savingPlanDetails ? 'Saving...' : 'Save Plan Details'}
                      </Button>
                    </div>
                  </form>
                )}

                {/* TAB 2: MODULE ASSIGNMENT (PATCH /:id/module) */}
                {editPlanTab === 'modules' && (
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
                      <Button type="button" variant="secondary" onClick={closeEditPlanModal}>
                        Done
                      </Button>
                    </div>
                  </div>
                )}

                {/* TAB 3: RESOURCE LIMITS (PATCH /:id/resource-limit) */}
                {editPlanTab === 'limits' && (
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
                      <Button type="button" variant="secondary" onClick={closeEditPlanModal}>
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

      {/* ASSIGN SUBSCRIPTION MODAL (POST /api/organization-subscription) */}
      {showAssignModal && (
        <div className={styles.modalOverlay} onClick={() => setShowAssignModal(false)}>
          <form
            className={styles.modalForm}
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleAssignSubscription}
          >
            <h2 className={styles.modalTitle}>Assign Subscription to Organization</h2>

            <label className={styles.fieldLabel}>
              Organization *
              <select
                required
                className={styles.selectField}
                value={assignForm.organizationId}
                onChange={(e) => setAssignForm({ ...assignForm, organizationId: e.target.value })}
              >
                <option value="" disabled>Select an organization</option>
                {orgList.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.fieldLabel}>
              Subscription Plan *
              <select
                required
                className={styles.selectField}
                value={assignForm.subscriptionPlanId}
                onChange={(e) => setAssignForm({ ...assignForm, subscriptionPlanId: e.target.value })}
              >
                <option value="" disabled>Select a plan tier</option>
                {planDropdownList.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (${p.priceMonthly || 0}/mo)
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.fieldLabel}>
              Initial Status
              <select
                className={styles.selectField}
                value={assignForm.status}
                onChange={(e) => setAssignForm({ ...assignForm, status: e.target.value })}
              >
                {SUBSCRIPTION_STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>

            <div className={styles.fieldRow}>
              <label className={styles.fieldLabel}>
                Start Date *
                <input
                  required
                  type="date"
                  className={styles.inputField}
                  value={assignForm.startDate}
                  onChange={(e) => setAssignForm({ ...assignForm, startDate: e.target.value })}
                />
              </label>

              <label className={styles.fieldLabel}>
                End Date (Optional)
                <input
                  type="date"
                  className={styles.inputField}
                  value={assignForm.endDate}
                  onChange={(e) => setAssignForm({ ...assignForm, endDate: e.target.value })}
                />
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
              <Button type="button" variant="secondary" onClick={() => setShowAssignModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={assigning}>
                {assigning ? 'Assigning...' : 'Assign Subscription'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* EDIT SUBSCRIPTION MODAL (GET :id, PUT :id) */}
      {editingOrgSub && (
        <div className={styles.modalOverlay} onClick={closeEditOrgSubModal}>
          <form
            className={styles.modalForm}
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleUpdateOrgSub}
          >
            <div className={styles.sectionHeader}>
              <div>
                <h2 className={styles.modalTitle}>Edit Organization Subscription</h2>
                <small style={{ color: 'var(--color-text-secondary)' }}>ID: {editingOrgSub.id}</small>
              </div>
              <button
                type="button"
                onClick={closeEditOrgSubModal}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--color-text-secondary)' }}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {loadingEditOrgSub ? (
              <div className={styles.tabLoading}>Loading subscription details...</div>
            ) : (
              <>
                <label className={styles.fieldLabel}>
                  Organization (Display-only)
                  <input
                    disabled
                    type="text"
                    className={styles.inputField}
                    value={editingOrgSub.organizationData?.name || editingOrgSub.organization?.name || 'Assigned Organization'}
                  />
                </label>

                <label className={styles.fieldLabel}>
                  Subscription Plan *
                  <select
                    required
                    className={styles.selectField}
                    value={editOrgSubForm.subscriptionPlanId}
                    onChange={(e) => setEditOrgSubForm({ ...editOrgSubForm, subscriptionPlanId: e.target.value })}
                  >
                    {planDropdownList.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (${p.priceMonthly || 0}/mo)
                      </option>
                    ))}
                  </select>
                </label>

                <label className={styles.fieldLabel}>
                  Subscription Status *
                  <select
                    required
                    className={styles.selectField}
                    value={editOrgSubForm.status}
                    onChange={(e) => setEditOrgSubForm({ ...editOrgSubForm, status: e.target.value })}
                  >
                    {SUBSCRIPTION_STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </label>

                <div className={styles.fieldRow}>
                  <label className={styles.fieldLabel}>
                    Start Date
                    <input
                      type="date"
                      className={styles.inputField}
                      value={editOrgSubForm.startDate}
                      onChange={(e) => setEditOrgSubForm({ ...editOrgSubForm, startDate: e.target.value })}
                    />
                  </label>

                  <label className={styles.fieldLabel}>
                    End Date
                    <input
                      type="date"
                      className={styles.inputField}
                      value={editOrgSubForm.endDate}
                      onChange={(e) => setEditOrgSubForm({ ...editOrgSubForm, endDate: e.target.value })}
                    />
                  </label>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                  <Button type="button" variant="secondary" onClick={closeEditOrgSubModal}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" disabled={savingEditOrgSub}>
                    {savingEditOrgSub ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </>
            )}
          </form>
        </div>
      )}
    </div>
  );
}
