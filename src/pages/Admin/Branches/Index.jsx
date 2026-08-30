/**
 * @file Admin/Branches/Index.jsx
 * @description Frontend organization branch management screen.
 */

import React, { useEffect, useMemo, useState } from 'react';
import Button from '@components/Button/Button';
import { useAuth } from '@hooks/useAuth';
import { lookupService } from '@services/lookupService';
import styles from './Index.module.css';
import branchService from '@services/branchService';

const emptyForm = {
  name: '',
  code: '',
  location: '',
  countryId: '',
  manager: '',
  rooms: '',
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
    branches = [],
    addBranch,
    updateBranch,
    toggleBranch,
  } = useAuth();

  const [showModal, setShowModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [countries, setCountries] = useState([
    { id: '1', name: 'United States' },
    { id: '2', name: 'India' },
    { id: '3', name: 'United Kingdom' },
    { id: '4', name: 'Canada' },
  ]);

  useEffect(() => {
    async function loadCountries() {
      try {
        const res = await lookupService.getCountries();
        const countryList = res?.data?.responses || res?.data?.rows || res?.data?.data || (Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []));
        if (Array.isArray(countryList) && countryList.length > 0) {
          setCountries(countryList);
        }
      } catch (err) {
        console.warn('Country lookup API fallback:', err);
      }
    }
    loadCountries();
  }, []);

  const activeBranches = useMemo(
    () =>
      branches.filter(
        (branch) => branch.status === 'Active'
      ).length,
    [branches]
  );

  const totalRooms = useMemo(
    () =>
      branches.reduce(
        (total, branch) =>
          total + Number(branch.rooms || 0),
        0
      ),
    [branches]
  );

  const totalStaff = useMemo(
    () =>
      branches.reduce(
        (total, branch) =>
          total + Number(branch.staff || 0),
        0
      ),
    [branches]
  );

  const openCreate = () => {
    setEditingBranch(null);
    setForm({ ...emptyForm });
    setShowModal(true);
  };

  const openEdit = (branch) => {
    setEditingBranch(branch);

    setForm({
      name: branch?.name || '',
      code: branch?.code || '',
      location: branch?.location || '',
      manager:
        branch?.manager === 'Unassigned'
          ? ''
          : branch?.manager || '',
      rooms:
        branch?.rooms === undefined ||
          branch?.rooms === null
          ? ''
          : String(branch.rooms),
    });

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingBranch(null);
    setForm({ ...emptyForm });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]:
        name === 'code'
          ? value.toUpperCase()
          : value,
    }));
  };

  const saveBranch = (event) => {
    event.preventDefault();

    const name = form.name.trim();
    const code = form.code.trim();
    const location = form.location.trim();
    const manager = form.manager.trim();
    const rooms = form.rooms.trim();

    if (!name || !code || !location) {
      return;
    }

    const branchData = {
      name,
      code,
      location,
      manager,
      rooms,
    };

    if (editingBranch) {
      updateBranch(
        editingBranch.id,
        branchData
      );
    } else {
      addBranch(branchData);
    }

    closeModal();
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <div className={styles.eyebrow}>
            ADMINISTRATION
          </div>

          <h1 className={styles.title}>
            Organization & Branches
          </h1>

          <p className={styles.subtitle}>
            Manage hotel properties, locations and
            branch-level operations.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={openCreate}
        >
          + Add Branch
        </Button>
      </header>

      <section className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span>Total Branches</span>

          <strong>{branches.length}</strong>

          <small>
            {activeBranches} currently active
          </small>
        </div>

        <div className={styles.statCard}>
          <span>Total Rooms</span>

          <strong>{totalRooms}</strong>

          <small>
            Across all properties
          </small>
        </div>

        <div className={styles.statCard}>
          <span>Total Staff</span>

          <strong>{totalStaff}</strong>

          <small>
            Across all branches
          </small>
        </div>

        <div className={styles.statCard}>
          <span>Properties</span>

          <strong>{branches.length}</strong>

          <small>
            Managed locations
          </small>
        </div>
      </section>

      <section className={styles.branchGrid}>
        {branches.map((branch) => (
          <article
            className={styles.branchCard}
            key={branch.id}
          >
            <div className={styles.cardTop}>
              <div className={styles.branchIcon}>
                {getBranchInitials(branch)}
              </div>

              <span
                className={`${styles.status} ${branch.status === 'Active'
                  ? styles.statusActive
                  : styles.statusInactive
                  }`}
              >
                <i />

                {branch.status}
              </span>
            </div>

            <div className={styles.branchInfo}>
              <span className={styles.code}>
                {branch.code}
              </span>

              <h2>{branch.name}</h2>

              <p>{branch.location}</p>
            </div>

            <div className={styles.manager}>
              <span>Branch Manager</span>

              <strong>
                {getBranchManager(branch)}
              </strong>
            </div>

            <div className={styles.metrics}>
              <div>
                <strong>
                  {Number(branch.rooms || 0)}
                </strong>

                <span>Rooms</span>
              </div>

              <div>
                <strong>
                  {Number(branch.staff || 0)}
                </strong>

                <span>Staff</span>
              </div>

              <div>
                <strong>
                  {Number(branch.occupancy || 0)}%
                </strong>

                <span>Occupancy</span>
              </div>
            </div>

            <div className={styles.cardActions}>
              <button
                type="button"
                onClick={() => openEdit(branch)}
              >
                Edit Branch
              </button>

              <button
                type="button"
                onClick={() =>
                  toggleBranch(branch.id)
                }
              >
                {branch.status === 'Active'
                  ? 'Deactivate'
                  : 'Activate'}
              </button>

              <button
                type="button"
                onClick={async () => {
                  if (window.confirm('Are you sure you want to delete this branch?')) {
                    try {
                      await branchService.delete(branch.id);
                    } catch (e) {
                      console.warn('Branch delete fallback:', e);
                    }
                  }
                }}
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
          onClick={openCreate}
        >
          <span>+</span>

          <strong>Add New Branch</strong>

          <small>
            Create another property.
          </small>
        </button>
      </section>

      {showModal && (
        <div
          className={styles.modalOverlay}
          onMouseDown={closeModal}
          role="presentation"
        >
          <form
            className={styles.modal}
            onSubmit={saveBranch}
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            <div className={styles.modalHeader}>
              <div>
                <h2>
                  {editingBranch
                    ? 'Edit Branch'
                    : 'Add Branch'}
                </h2>

                <p>
                  Configure the property information
                  below.
                </p>
              </div>

              <button
                type="button"
                className={styles.close}
                onClick={closeModal}
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            <label>
              Branch Name

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Branch name"
                required
              />
            </label>

            <div className={styles.formGrid}>
              <label>
                Branch Code

                <input
                  name="code"
                  value={form.code}
                  onChange={handleChange}
                  placeholder="Branch code"
                  required
                />
              </label>

              <label>
                Number of Rooms

                <input
                  name="rooms"
                  type="number"
                  min="0"
                  value={form.rooms}
                  onChange={handleChange}
                  placeholder="0"
                />
              </label>
            </div>

            <label>
              Location

              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Branch location"
                required
              />
            </label>

            <label>
              Country

              <select
                name="countryId"
                value={form.countryId}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.8rem',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  marginTop: '0.25rem',
                  backgroundColor: '#fff',
                }}
              >
                <option value="">Select Country</option>
                {countries.map((country) => (
                  <option key={country.id || country.code || country.name} value={country.id || country.code || country.name}>
                    {country.name || country.code}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Branch Manager

              <input
                name="manager"
                value={form.manager}
                onChange={handleChange}
                placeholder="Manager name"
              />
            </label>

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
                {editingBranch
                  ? 'Save Changes'
                  : 'Create Branch'}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}