/**
 * @file Admin/Branches/Index.jsx
 * @description Organization & Branch management screen.
 * Fully binds both Branch (/api/organization-branch) and Organization (/api/organization) APIs.
 */

import React, { useEffect, useMemo, useState } from 'react';
import Button from '@components/Button/Button';
import { useAuth } from '@hooks/useAuth';
import { lookupService } from '@services/lookupService';
import branchService from '@services/branchService';
import organizationService from '@services/organizationService';
import orgTypeService from '@services/orgTypeService';
import styles from './Index.module.css';

const emptyBranchForm = {
  name: '',
  code: '',
  location: '',
  countryId: '',
  manager: '',
  rooms: '',
  email: '',
  phoneNo: '',
};

const emptyOrgForm = {
  name: '',
  legalName: '',
  organizationTypeId: '',
  email: '',
  phoneNo: '',
  registrationNo: '',
  gstNo: '',
  website: '',
  status: 'active',
};

const getBranchInitials = (branch) => {
  const source = branch?.code || branch?.name || '';
  return source
    .trim()
    .split(/[\s-_]+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
};

const getBranchManager = (branch) =>
  branch?.manager?.trim() || 'Unassigned';

export default function AdminBranchesPage() {
  const {
    user,
    branches = [],
    addBranch,
    updateBranch,
    toggleBranch,
  } = useAuth();

  const [activeTab, setActiveTab] = useState('branches'); // 'branches' | 'organizations'

  // Branches state
  const [branchList, setBranchList] = useState(branches);
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [branchForm, setBranchForm] = useState(emptyBranchForm);
  const [countries, setCountries] = useState([
    { id: '1', name: 'United States' },
    { id: '2', name: 'India' },
    { id: '3', name: 'United Kingdom' },
    { id: '4', name: 'Canada' },
  ]);

  // Organizations state
  const [organizations, setOrganizations] = useState([]);
  const [orgTypes, setOrgTypes] = useState([]);
  const [showOrgModal, setShowOrgModal] = useState(false);
  const [editingOrg, setEditingOrg] = useState(null);
  const [orgForm, setOrgForm] = useState(emptyOrgForm);
  const [viewingOrg, setViewingOrg] = useState(null);
  const [loadingOrgs, setLoadingOrgs] = useState(false);

  // Sync with auth branches when available
  useEffect(() => {
    if (Array.isArray(branches) && branches.length > 0 && branchList.length === 0) {
      setBranchList(branches);
    }
  }, [branches]);

  // Load backend branches
  const loadBranches = async () => {
    try {
      const res = await branchService.getAll();
      const rawList =
        res?.data?.responses ||
        res?.data?.rows ||
        res?.data?.data ||
        (Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : []);

      if (Array.isArray(rawList) && rawList.length > 0) {
        const mapped = rawList.map((b) => ({
          id: b.id || b._id,
          name: b.branchName || b.name,
          code: b.code || `BR-${b.id}`,
          location: b.addressLine1 || b.location || 'Branch Location',
          manager: b.manager || 'Unassigned',
          rooms: b.rooms || 0,
          staff: b.staff || 0,
          occupancy: b.occupancy || 0,
          status: b.status === 'INACTIVE' ? 'Inactive' : 'Active',
          email: b.email,
          phoneNo: b.phoneNo,
          countryId: b.countryId,
          organizationId: b.organizationId,
        }));
        setBranchList(mapped);
      }
    } catch (err) {
      console.warn('Branch API offline, using local branch state.', err);
    }
  };

  // Load organizations
  const loadOrganizations = async () => {
    setLoadingOrgs(true);
    try {
      const res = await organizationService.getAll();
      const list =
        res?.data?.responses ||
        res?.data?.rows ||
        res?.data?.data ||
        (Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : []);

      if (Array.isArray(list)) {
        setOrganizations(list);
        if (list.length > 0 && list[0]?.id && !localStorage.getItem('syncstays_org_id')) {
          localStorage.setItem('syncstays_org_id', list[0].id);
        }
      }
    } catch (err) {
      console.warn('Organizations API offline:', err);
    } finally {
      setLoadingOrgs(false);
    }
  };

  // Load initial lookups (countries, organization types, branches, organizations)
  useEffect(() => {
    async function loadData() {
      try {
        const res = await lookupService.getCountries();
        const countryList =
          res?.data?.responses ||
          res?.data?.rows ||
          res?.data?.data ||
          (Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : []);
        if (Array.isArray(countryList) && countryList.length > 0) {
          setCountries(countryList);
        }
      } catch (err) {
        console.warn('Country lookup API fallback:', err);
      }

      try {
        const typeRes = await orgTypeService.getAll();
        const typeList =
          typeRes?.data?.responses ||
          typeRes?.data?.rows ||
          typeRes?.data?.data ||
          (Array.isArray(typeRes?.data) ? typeRes.data : Array.isArray(typeRes) ? typeRes : []);
        if (Array.isArray(typeList) && typeList.length > 0) {
          setOrgTypes(typeList);
        }
      } catch (err) {
        console.warn('Org type lookup fallback:', err);
      }

      loadBranches();
      loadOrganizations();
    }

    loadData();
  }, []);

  // Stats computed from active branches
  const activeBranches = useMemo(
    () => branchList.filter((branch) => branch.status === 'Active').length,
    [branchList]
  );

  const totalRooms = useMemo(
    () =>
      branchList.reduce(
        (total, branch) => total + Number(branch.rooms || 0),
        0
      ),
    [branchList]
  );

  const totalStaff = useMemo(
    () =>
      branchList.reduce(
        (total, branch) => total + Number(branch.staff || 0),
        0
      ),
    [branchList]
  );

  // ==========================================
  // BRANCH HANDLERS (CRUD + Status Toggle)
  // ==========================================

  const openCreateBranch = () => {
    setEditingBranch(null);
    setBranchForm({ ...emptyBranchForm });
    setShowBranchModal(true);
  };

  const openEditBranch = async (branch) => {
    setEditingBranch(branch);
    setBranchForm({
      name: branch?.name || '',
      code: branch?.code || '',
      location: branch?.location || '',
      manager: branch?.manager === 'Unassigned' ? '' : branch?.manager || '',
      rooms:
        branch?.rooms === undefined || branch?.rooms === null
          ? ''
          : String(branch.rooms),
      email: branch?.email || '',
      phoneNo: branch?.phoneNo || '',
      countryId: branch?.countryId || '',
    });
    setShowBranchModal(true);

    // Call GET /api/organization-branch/:id to fetch fresh record from backend
    if (branch?.id) {
      try {
        const res = await branchService.getById(branch.id);
        const fresh = res?.data || res;
        if (fresh && (fresh.id || fresh.name)) {
          setBranchForm((prev) => ({
            ...prev,
            name: fresh.name || fresh.branchName || prev.name,
            code: fresh.code || prev.code,
            location: fresh.addressLine1 || fresh.location || prev.location,
            email: fresh.email || prev.email,
            phoneNo: fresh.phoneNo || prev.phoneNo,
            countryId: fresh.countryId || prev.countryId,
          }));
        }
      } catch (err) {
        console.warn('Could not fetch fresh branch details by id:', err);
      }
    }
  };

  const closeBranchModal = () => {
    setShowBranchModal(false);
    setEditingBranch(null);
    setBranchForm({ ...emptyBranchForm });
  };

  const handleBranchChange = (event) => {
    const { name, value } = event.target;
    setBranchForm((current) => ({
      ...current,
      [name]: name === 'code' ? value.toUpperCase() : value,
    }));
  };

  const saveBranch = async (event) => {
    event.preventDefault();

    const name = branchForm.name.trim();
    const code = branchForm.code.trim();
    const location = branchForm.location.trim();
    const manager = branchForm.manager.trim();
    const rooms = branchForm.rooms.trim();

    if (!name || !code || !location) {
      return;
    }

    const branchData = {
      name,
      code,
      location,
      manager,
      rooms: Number(rooms) || 0,
      email: branchForm.email.trim() || undefined,
      phoneNo: branchForm.phoneNo.trim() || undefined,
      countryId: branchForm.countryId || undefined,
    };

    const targetOrgId =
      user?.organizationId ||
      localStorage.getItem('syncstays_org_id') ||
      organizations[0]?.id;

    if (editingBranch) {
      // Call PUT /api/organization-branch/:id
      try {
        const updatePayload = {
          name,
          code,
          addressLine1: location,
          ...(branchForm.countryId ? { countryId: branchForm.countryId } : {}),
          ...(branchForm.email ? { email: branchForm.email.trim() } : {}),
          ...(branchForm.phoneNo ? { phoneNo: branchForm.phoneNo.trim() } : {}),
        };
        const res = await branchService.update(editingBranch.id, updatePayload);
        const updated = res?.data || updatePayload;

        setBranchList((prev) =>
          prev.map((b) =>
            b.id === editingBranch.id
              ? {
                  ...b,
                  name: updated.name || name,
                  code: updated.code || code,
                  location: updated.addressLine1 || location,
                  manager: manager || b.manager,
                  rooms: Number(rooms) || b.rooms,
                }
              : b
          )
        );
        updateBranch(editingBranch.id, branchData);
      } catch (err) {
        console.warn('Branch update API fallback:', err);
        updateBranch(editingBranch.id, branchData);
        setBranchList((prev) =>
          prev.map((b) =>
            b.id === editingBranch.id ? { ...b, ...branchData } : b
          )
        );
      }
    } else {
      // Call POST /api/organization-branch
      try {
        const createPayload = {
          name,
          code,
          addressLine1: location,
          organizationId: targetOrgId,
          ...(branchForm.countryId ? { countryId: branchForm.countryId } : {}),
          ...(branchForm.email ? { email: branchForm.email.trim() } : {}),
          ...(branchForm.phoneNo ? { phoneNo: branchForm.phoneNo.trim() } : {}),
          status: 'active',
        };
        const res = await branchService.create(createPayload);
        const newRecord = res?.data || { ...createPayload, id: `br-${Date.now()}` };

        const mappedNew = {
          id: newRecord.id || newRecord._id || `br-${Date.now()}`,
          name: newRecord.name || name,
          code: newRecord.code || code,
          location: newRecord.addressLine1 || location,
          manager: manager || 'Unassigned',
          rooms: Number(rooms) || 0,
          staff: 0,
          occupancy: 0,
          status: 'Active',
        };
        setBranchList((prev) => [...prev, mappedNew]);
        addBranch(mappedNew);
      } catch (err) {
        console.warn('Branch create API fallback:', err);
        const localBranch = addBranch(branchData);
        setBranchList((prev) => [...prev, localBranch]);
      }
    }

    closeBranchModal();
  };

  const handleToggleBranch = async (branch) => {
    const nextStatus = branch.status === 'Active' ? 'Inactive' : 'Active';
    const apiStatus = nextStatus === 'Active' ? 'active' : 'inactive';

    // Call PUT /api/organization-branch/:id with status
    try {
      await branchService.update(branch.id, { status: apiStatus });
    } catch (err) {
      console.warn('Branch status toggle API fallback:', err);
    }

    toggleBranch(branch.id);
    setBranchList((prev) =>
      prev.map((b) => (b.id === branch.id ? { ...b, status: nextStatus } : b))
    );
  };

  const handleDeleteBranch = async (branch) => {
    if (!window.confirm(`Are you sure you want to delete branch "${branch.name}"?`)) {
      return;
    }

    // Call DELETE /api/organization-branch/:id
    try {
      await branchService.delete(branch.id);
    } catch (err) {
      console.warn('Branch delete fallback:', err);
    }

    setBranchList((prev) => prev.filter((b) => b.id !== branch.id));
  };

  // ==========================================
  // ORGANIZATION HANDLERS (CRUD + View)
  // ==========================================

  const openCreateOrg = () => {
    setEditingOrg(null);
    setOrgForm({
      ...emptyOrgForm,
      organizationTypeId: orgTypes[0]?.id || '',
    });
    setShowOrgModal(true);
  };

  const openEditOrg = async (org) => {
    setEditingOrg(org);
    setOrgForm({
      name: org?.name || '',
      legalName: org?.legalName || org?.name || '',
      organizationTypeId: org?.organizationTypeId || orgTypes[0]?.id || '',
      email: org?.email || '',
      phoneNo: org?.phoneNo || '',
      registrationNo: org?.registrationNo || '',
      gstNo: org?.gstNo || '',
      website: org?.website || '',
      status: org?.status || 'ACTIVE',
    });
    setShowOrgModal(true);

    // Call GET /api/organization/:id to fetch fresh record
    if (org?.id) {
      try {
        const res = await organizationService.getById(org.id);
        const fresh = res?.data || res;
        if (fresh && (fresh.id || fresh.name)) {
          setOrgForm((prev) => ({
            ...prev,
            name: fresh.name || prev.name,
            legalName: fresh.legalName || prev.legalName,
            organizationTypeId: fresh.organizationTypeId || prev.organizationTypeId,
            email: fresh.email || prev.email,
            phoneNo: fresh.phoneNo || prev.phoneNo,
            registrationNo: fresh.registrationNo || prev.registrationNo,
            gstNo: fresh.gstNo || prev.gstNo,
            website: fresh.website || prev.website,
            status: fresh.status || prev.status,
          }));
        }
      } catch (err) {
        console.warn('Could not fetch fresh organization details:', err);
      }
    }
  };

  const handleViewOrgDetails = async (org) => {
    setViewingOrg(org);
    // Call GET /api/organization/:id
    if (org?.id) {
      try {
        const res = await organizationService.getById(org.id);
        const fresh = res?.data || res;
        if (fresh && (fresh.id || fresh.name)) {
          setViewingOrg(fresh);
        }
      } catch (err) {
        console.warn('Could not fetch organization details by id:', err);
      }
    }
  };

  const closeOrgModal = () => {
    setShowOrgModal(false);
    setEditingOrg(null);
    setOrgForm({ ...emptyOrgForm });
  };

  const handleOrgChange = (event) => {
    const { name, value } = event.target;
    setOrgForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const saveOrganization = async (event) => {
    event.preventDefault();

    const name = orgForm.name.trim();
    const legalName = (orgForm.legalName || name).trim();
    const email = orgForm.email.trim();
    const phoneNo = orgForm.phoneNo.trim();
    const organizationTypeId = orgForm.organizationTypeId || orgTypes[0]?.id;

    if (!name || !legalName || !email || !phoneNo) {
      if (typeof window !== 'undefined' && window.alert) {
        window.alert('Please fill in all required organization fields.');
      }
      return;
    }

    const payload = {
      name,
      legalName,
      organizationTypeId,
      email,
      phoneNo,
      ...(orgForm.registrationNo ? { registrationNo: orgForm.registrationNo.trim() } : {}),
      ...(orgForm.gstNo ? { gstNo: orgForm.gstNo.trim() } : {}),
      ...(orgForm.website ? { website: orgForm.website.trim() } : {}),
      status: orgForm.status ? orgForm.status.toLowerCase() : 'active',
    };

    if (editingOrg) {
      // Call PUT /api/organization/:id
      try {
        const res = await organizationService.update(editingOrg.id, payload);
        const updated = res?.data || { ...editingOrg, ...payload };
        setOrganizations((prev) =>
          prev.map((o) => (o.id === editingOrg.id ? { ...o, ...updated } : o))
        );
      } catch (err) {
        console.warn('Organization update API error:', err);
        setOrganizations((prev) =>
          prev.map((o) => (o.id === editingOrg.id ? { ...o, ...payload } : o))
        );
      }
    } else {
      // Call POST /api/organization
      try {
        const res = await organizationService.create(payload);
        const created = res?.data || { ...payload, id: `org-${Date.now()}` };
        setOrganizations((prev) => [...prev, created]);
        if (!localStorage.getItem('syncstays_org_id') && created.id) {
          localStorage.setItem('syncstays_org_id', created.id);
        }
      } catch (err) {
        console.warn('Organization create API error:', err);
        setOrganizations((prev) => [...prev, { ...payload, id: `org-${Date.now()}` }]);
      }
    }

    closeOrgModal();
  };

  const handleDeleteOrganization = async (org) => {
    if (
      !window.confirm(
        `Are you sure you want to delete organization "${org.name}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    // Call DELETE /api/organization/:id
    try {
      await organizationService.delete(org.id);
    } catch (err) {
      console.warn('Organization delete API fallback:', err);
    }

    setOrganizations((prev) => prev.filter((o) => o.id !== org.id));
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <div className={styles.eyebrow}>ADMINISTRATION</div>
          <h1 className={styles.title}>Organization & Branches</h1>
          <p className={styles.subtitle}>
            Manage hotel properties, locations, and multi-tenant organization profiles.
          </p>
        </div>

        {activeTab === 'branches' ? (
          <Button variant="primary" onClick={openCreateBranch}>
            + Add Branch
          </Button>
        ) : (
          <Button variant="primary" onClick={openCreateOrg}>
            + Add Organization
          </Button>
        )}
      </header>

      {/* Tabs Navigation */}
      <div className={styles.tabsContainer}>
        <button
          type="button"
          className={`${styles.tabButton} ${
            activeTab === 'branches' ? styles.tabButtonActive : ''
          }`}
          onClick={() => setActiveTab('branches')}
        >
          Properties & Branches ({branchList.length})
        </button>
        <button
          type="button"
          className={`${styles.tabButton} ${
            activeTab === 'organizations' ? styles.tabButtonActive : ''
          }`}
          onClick={() => setActiveTab('organizations')}
        >
          Organizations ({organizations.length})
        </button>
      </div>

      {/* ==========================================
          TAB 1: BRANCHES VIEW
          ========================================== */}
      {activeTab === 'branches' && (
        <>
          <section className={styles.statsGrid}>
            <div className={styles.statCard}>
              <span>Total Branches</span>
              <strong>{branchList.length}</strong>
              <small>{activeBranches} currently active</small>
            </div>

            <div className={styles.statCard}>
              <span>Total Rooms</span>
              <strong>{totalRooms}</strong>
              <small>Across all properties</small>
            </div>

            <div className={styles.statCard}>
              <span>Total Staff</span>
              <strong>{totalStaff}</strong>
              <small>Across all branches</small>
            </div>

            <div className={styles.statCard}>
              <span>Properties</span>
              <strong>{branchList.length}</strong>
              <small>Managed locations</small>
            </div>
          </section>

          <section className={styles.branchGrid}>
            {branchList.map((branch) => (
              <article className={styles.branchCard} key={branch.id}>
                <div className={styles.cardTop}>
                  <div className={styles.branchIcon}>
                    {getBranchInitials(branch)}
                  </div>

                  <span
                    className={`${styles.status} ${
                      branch.status === 'Active'
                        ? styles.statusActive
                        : styles.statusInactive
                    }`}
                  >
                    <i />
                    {branch.status}
                  </span>
                </div>

                <div className={styles.branchInfo}>
                  <span className={styles.code}>{branch.code}</span>
                  <h2>{branch.name}</h2>
                  <p>{branch.location}</p>
                </div>

                <div className={styles.manager}>
                  <span>Branch Manager</span>
                  <strong>{getBranchManager(branch)}</strong>
                </div>

                <div className={styles.metrics}>
                  <div>
                    <strong>{Number(branch.rooms || 0)}</strong>
                    <span>Rooms</span>
                  </div>
                  <div>
                    <strong>{Number(branch.staff || 0)}</strong>
                    <span>Staff</span>
                  </div>
                  <div>
                    <strong>{Number(branch.occupancy || 0)}%</strong>
                    <span>Occupancy</span>
                  </div>
                </div>

                <div className={styles.cardActions}>
                  <button
                    type="button"
                    onClick={() => openEditBranch(branch)}
                  >
                    Edit Branch
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleBranch(branch)}
                  >
                    {branch.status === 'Active' ? 'Deactivate' : 'Activate'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteBranch(branch)}
                    style={{ color: '#dc2626' }}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}

            <button
              type="button"
              className={styles.addCard}
              onClick={openCreateBranch}
            >
              <span>+</span>
              <strong>Add New Branch</strong>
              <small>Create another property.</small>
            </button>
          </section>
        </>
      )}

      {/* ==========================================
          TAB 2: ORGANIZATIONS VIEW
          ========================================== */}
      {activeTab === 'organizations' && (
        <section className={styles.orgGrid}>
          {organizations.length === 0 && !loadingOrgs ? (
            <div
              style={{
                gridColumn: '1 / -1',
                padding: '40px',
                textAlign: 'center',
                background: 'var(--color-surface)',
                borderRadius: '12px',
                border: '1px dashed var(--color-border)',
                color: 'var(--color-text-secondary)',
              }}
            >
              <p style={{ margin: '0 0 12px 0', fontSize: '14px' }}>
                No organizations registered yet.
              </p>
              <Button variant="primary" onClick={openCreateOrg}>
                + Add First Organization
              </Button>
            </div>
          ) : (
            organizations.map((org) => {
              const matchedType = orgTypes.find(
                (t) => t.id === org.organizationTypeId
              );
              const typeLabel =
                matchedType?.type ||
                matchedType?.typeName ||
                org.organizationType?.type ||
                org.organizationType?.typeName ||
                'Hotel Property';

              return (
                <article className={styles.orgCard} key={org.id}>
                  <div className={styles.orgHeader}>
                    <div className={styles.orgTitleGroup}>
                      <h2>{org.name}</h2>
                      <p className={styles.orgSubtitle}>
                        {org.legalName || org.name}
                      </p>
                    </div>

                    <span
                      className={`${styles.badge} ${
                        org.status === 'INACTIVE'
                          ? styles.badgeInactive
                          : styles.badgeActive
                      }`}
                    >
                      {org.status || 'ACTIVE'}
                    </span>
                  </div>

                  <div className={styles.orgDetailsGrid}>
                    <div className={styles.orgDetailItem}>
                      <span>Organization Type</span>
                      <strong>{typeLabel}</strong>
                    </div>

                    <div className={styles.orgDetailItem}>
                      <span>Contact Email</span>
                      <strong>{org.email || 'N/A'}</strong>
                    </div>

                    <div className={styles.orgDetailItem}>
                      <span>Phone Number</span>
                      <strong>{org.phoneNo || 'N/A'}</strong>
                    </div>

                    <div className={styles.orgDetailItem}>
                      <span>GST / Tax ID</span>
                      <strong>{org.gstNo || 'Not Registered'}</strong>
                    </div>

                    {org.registrationNo && (
                      <div className={styles.orgDetailItem}>
                        <span>Registration No</span>
                        <strong>{org.registrationNo}</strong>
                      </div>
                    )}

                    {org.website && (
                      <div className={styles.orgDetailItem}>
                        <span>Website</span>
                        <strong>{org.website}</strong>
                      </div>
                    )}
                  </div>

                  <div className={styles.cardActions}>
                    <button
                      type="button"
                      onClick={() => handleViewOrgDetails(org)}
                    >
                      View Details
                    </button>

                    <button
                      type="button"
                      onClick={() => openEditOrg(org)}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteOrganization(org)}
                      style={{ color: '#dc2626' }}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              );
            })
          )}
        </section>
      )}

      {/* ==========================================
          BRANCH MODAL (CREATE / EDIT)
          ========================================== */}
      {showBranchModal && (
        <div className={styles.modalOverlay} onClick={closeBranchModal}>
          <form
            className={styles.modal}
            onClick={(event) => event.stopPropagation()}
            onSubmit={saveBranch}
          >
            <div className={styles.modalHeader}>
              <div>
                <h2>
                  {editingBranch ? 'Edit Branch' : 'Add New Branch'}
                </h2>
                <p>
                  Fill out the property details for this branch location.
                </p>
              </div>

              <button
                type="button"
                className={styles.closeBtn}
                onClick={closeBranchModal}
              >
                ✕
              </button>
            </div>

            <label>
              Branch Name *
              <input
                name="name"
                value={branchForm.name}
                onChange={handleBranchChange}
                placeholder="e.g. Grand Hotel - Downtown"
                required
              />
            </label>

            <div className={styles.formGrid}>
              <label>
                Branch Code *
                <input
                  name="code"
                  value={branchForm.code}
                  onChange={handleBranchChange}
                  placeholder="e.g. DT-01"
                  required
                />
              </label>

              <label>
                Number of Rooms
                <input
                  name="rooms"
                  type="number"
                  min="0"
                  value={branchForm.rooms}
                  onChange={handleBranchChange}
                  placeholder="0"
                />
              </label>
            </div>

            <label>
              Location Address *
              <input
                name="location"
                value={branchForm.location}
                onChange={handleBranchChange}
                placeholder="Street address or locality"
                required
              />
            </label>

            <div className={styles.formGrid}>
              <label>
                Email
                <input
                  name="email"
                  type="email"
                  value={branchForm.email}
                  onChange={handleBranchChange}
                  placeholder="branch@hotel.com"
                />
              </label>

              <label>
                Phone Number
                <input
                  name="phoneNo"
                  value={branchForm.phoneNo}
                  onChange={handleBranchChange}
                  placeholder="+1 (555) 000-0000"
                />
              </label>
            </div>

            <label>
              Country
              <select
                name="countryId"
                value={branchForm.countryId}
                onChange={handleBranchChange}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.8rem',
                  borderRadius: '6px',
                  border: '1px solid var(--color-border)',
                  marginTop: '0.25rem',
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-text-primary)',
                }}
              >
                <option value="">Select Country</option>
                {countries.map((country) => (
                  <option
                    key={country.id || country.code || country.name}
                    value={country.id || country.code || country.name}
                  >
                    {country.name || country.code}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Branch Manager
              <input
                name="manager"
                value={branchForm.manager}
                onChange={handleBranchChange}
                placeholder="Manager name"
              />
            </label>

            <div className={styles.modalActions}>
              <button type="button" onClick={closeBranchModal}>
                Cancel
              </button>

              <Button variant="primary" type="submit">
                {editingBranch ? 'Save Changes' : 'Create Branch'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* ==========================================
          ORGANIZATION MODAL (CREATE / EDIT)
          ========================================== */}
      {showOrgModal && (
        <div className={styles.modalOverlay} onClick={closeOrgModal}>
          <form
            className={styles.modal}
            onClick={(event) => event.stopPropagation()}
            onSubmit={saveOrganization}
          >
            <div className={styles.modalHeader}>
              <div>
                <h2>
                  {editingOrg ? 'Edit Organization' : 'Add New Organization'}
                </h2>
                <p>Register or update organizational entity details.</p>
              </div>

              <button
                type="button"
                className={styles.closeBtn}
                onClick={closeOrgModal}
              >
                ✕
              </button>
            </div>

            <label>
              Organization Name *
              <input
                name="name"
                value={orgForm.name}
                onChange={handleOrgChange}
                placeholder="e.g. Grand Hospitality Holdings"
                required
              />
            </label>

            <label>
              Legal / Registered Name *
              <input
                name="legalName"
                value={orgForm.legalName}
                onChange={handleOrgChange}
                placeholder="e.g. Grand Hospitality Holdings Pvt Ltd"
                required
              />
            </label>

            <label>
              Organization Type *
              <select
                name="organizationTypeId"
                value={orgForm.organizationTypeId}
                onChange={handleOrgChange}
                required
                style={{
                  width: '100%',
                  padding: '0.6rem 0.8rem',
                  borderRadius: '6px',
                  border: '1px solid var(--color-border)',
                  marginTop: '0.25rem',
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-text-primary)',
                }}
              >
                <option value="">Select Organization Type</option>
                {orgTypes.map((type) => (
                  <option
                    key={type.id || type.type || type.typeName}
                    value={type.id}
                  >
                    {type.type || type.typeName || type.name}
                  </option>
                ))}
              </select>
            </label>

            <div className={styles.formGrid}>
              <label>
                Email Address *
                <input
                  name="email"
                  type="email"
                  value={orgForm.email}
                  onChange={handleOrgChange}
                  placeholder="admin@grandhospitality.com"
                  required
                />
              </label>

              <label>
                Phone Number *
                <input
                  name="phoneNo"
                  value={orgForm.phoneNo}
                  onChange={handleOrgChange}
                  placeholder="+1 (555) 123-4567"
                  required
                />
              </label>
            </div>

            <div className={styles.formGrid}>
              <label>
                Registration Number
                <input
                  name="registrationNo"
                  value={orgForm.registrationNo}
                  onChange={handleOrgChange}
                  placeholder="e.g. REG-987654"
                />
              </label>

              <label>
                GST / Tax ID
                <input
                  name="gstNo"
                  value={orgForm.gstNo}
                  onChange={handleOrgChange}
                  placeholder="e.g. 27AAAAA0000A1Z5"
                />
              </label>
            </div>

            <label>
              Website URL
              <input
                name="website"
                value={orgForm.website}
                onChange={handleOrgChange}
                placeholder="https://www.grandhospitality.com"
              />
            </label>

            <div className={styles.modalActions}>
              <button type="button" onClick={closeOrgModal}>
                Cancel
              </button>

              <Button variant="primary" type="submit">
                {editingOrg ? 'Save Organization' : 'Create Organization'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* ==========================================
          ORGANIZATION DETAILS MODAL (VIEW)
          ========================================== */}
      {viewingOrg && (
        <div className={styles.detailOverlay} onClick={() => setViewingOrg(null)}>
          <div
            className={styles.detailCard}
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles.orgHeader}>
              <div>
                <h2 style={{ margin: 0, fontSize: '18px', color: 'var(--color-text-primary)' }}>
                  {viewingOrg.name}
                </h2>
                <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                  {viewingOrg.legalName || viewingOrg.name}
                </p>
              </div>

              <span
                className={`${styles.badge} ${
                  viewingOrg.status === 'INACTIVE'
                    ? styles.badgeInactive
                    : styles.badgeActive
                }`}
              >
                {viewingOrg.status || 'ACTIVE'}
              </span>
            </div>

            <div className={styles.orgDetailsGrid}>
              <div className={styles.orgDetailItem}>
                <span>Entity ID</span>
                <strong>{viewingOrg.id}</strong>
              </div>

              <div className={styles.orgDetailItem}>
                <span>Email</span>
                <strong>{viewingOrg.email || 'N/A'}</strong>
              </div>

              <div className={styles.orgDetailItem}>
                <span>Phone</span>
                <strong>{viewingOrg.phoneNo || 'N/A'}</strong>
              </div>

              <div className={styles.orgDetailItem}>
                <span>GST No</span>
                <strong>{viewingOrg.gstNo || 'Not Registered'}</strong>
              </div>

              <div className={styles.orgDetailItem}>
                <span>Registration No</span>
                <strong>{viewingOrg.registrationNo || 'N/A'}</strong>
              </div>

              <div className={styles.orgDetailItem}>
                <span>Website</span>
                <strong>{viewingOrg.website || 'N/A'}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <Button
                variant="secondary"
                onClick={() => setViewingOrg(null)}
              >
                Close
              </Button>

              <Button
                variant="primary"
                onClick={() => {
                  const orgToEdit = viewingOrg;
                  setViewingOrg(null);
                  openEditOrg(orgToEdit);
                }}
              >
                Edit Organization
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}