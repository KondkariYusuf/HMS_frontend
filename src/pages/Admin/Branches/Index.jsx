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
  stateId: '',
  cityId: '',
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
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  useEffect(() => {
    async function loadCountries() {
      setLoadingCountries(true);
      try {
        const res = await lookupService.getCountries({
          fetchAll: 'true',
          getAllCountry: 'true',
        });
        const countryList =
          res?.data?.responses ||
          res?.data?.rows ||
          res?.data?.data ||
          (Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []));
        if (Array.isArray(countryList) && countryList.length > 0) {
          setCountries(countryList);
        }
      } catch (err) {
        console.warn('Country lookup API fallback:', err);
      } finally {
        setLoadingCountries(false);
      }
    }
    loadCountries();
  }, []);

  useEffect(() => {
    if (!showModal) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showModal]);

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
    setStates([]);
    setCities([]);
    setShowModal(true);
  };

  const openEdit = async (branch) => {
    setEditingBranch(branch);

    const initialCountryId = branch?.countryId || branch?.country_id || '';
    const initialStateId = branch?.stateId || branch?.state_id || '';
    const initialCityId = branch?.cityId || branch?.city_id || '';

    setForm({
      name: branch?.name || '',
      code: branch?.code || '',
      location: branch?.location || branch?.addressLine1 || '',
      countryId: initialCountryId,
      stateId: initialStateId,
      cityId: initialCityId,
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

    if (initialCountryId) {
      setLoadingStates(true);
      try {
        const stateRes = await lookupService.getStates(initialCountryId, {
          fetchAll: 'true',
          getAllState: 'true',
        });
        const stateList =
          stateRes?.data?.responses ||
          stateRes?.data?.rows ||
          stateRes?.data?.data ||
          (Array.isArray(stateRes?.data) ? stateRes.data : (Array.isArray(stateRes) ? stateRes : []));
        setStates(Array.isArray(stateList) ? stateList : []);
      } catch (err) {
        console.warn('Failed to load states on edit:', err);
        setStates([]);
      } finally {
        setLoadingStates(false);
      }
    } else {
      setStates([]);
    }

    if (initialStateId) {
      setLoadingCities(true);
      try {
        const cityRes = await lookupService.getCities(initialStateId, {
          fetchAll: 'true',
          getAllCity: 'true',
        });
        const cityList =
          cityRes?.data?.responses ||
          cityRes?.data?.rows ||
          cityRes?.data?.data ||
          (Array.isArray(cityRes?.data) ? cityRes.data : (Array.isArray(cityRes) ? cityRes : []));
        setCities(Array.isArray(cityList) ? cityList : []);
      } catch (err) {
        console.warn('Failed to load cities on edit:', err);
        setCities([]);
      } finally {
        setLoadingCities(false);
      }
    } else {
      setCities([]);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingBranch(null);
    setForm({ ...emptyForm });
    setStates([]);
    setCities([]);
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

  const handleCountryChange = async (event) => {
    const selectedCountryId = event.target.value;
    setForm((current) => ({
      ...current,
      countryId: selectedCountryId,
      stateId: '',
      cityId: '',
    }));
    setStates([]);
    setCities([]);

    if (selectedCountryId) {
      setLoadingStates(true);
      try {
        const res = await lookupService.getStates(selectedCountryId, {
          fetchAll: 'true',
          getAllState: 'true',
        });
        const stateList =
          res?.data?.responses ||
          res?.data?.rows ||
          res?.data?.data ||
          (Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []));
        setStates(Array.isArray(stateList) ? stateList : []);
      } catch (err) {
        console.warn('Failed to load states for country:', err);
        setStates([]);
      } finally {
        setLoadingStates(false);
      }
    }
  };

  const handleStateChange = async (event) => {
    const selectedStateId = event.target.value;
    setForm((current) => ({
      ...current,
      stateId: selectedStateId,
      cityId: '',
    }));
    setCities([]);

    if (selectedStateId) {
      setLoadingCities(true);
      try {
        const res = await lookupService.getCities(selectedStateId, {
          fetchAll: 'true',
          getAllCity: 'true',
        });
        const cityList =
          res?.data?.responses ||
          res?.data?.rows ||
          res?.data?.data ||
          (Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []));
        setCities(Array.isArray(cityList) ? cityList : []);
      } catch (err) {
        console.warn('Failed to load cities for state:', err);
        setCities([]);
      } finally {
        setLoadingCities(false);
      }
    }
  };

  const handleCityChange = (event) => {
    const selectedCityId = event.target.value;
    setForm((current) => ({
      ...current,
      cityId: selectedCityId,
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
      countryId: form.countryId || undefined,
      stateId: form.stateId || undefined,
      cityId: form.cityId || undefined,
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
              Location / Address
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Street address or location details"
                required
              />
            </label>

            <div className={styles.formGrid}>
              <label>
                Country
                <select
                  name="countryId"
                  value={form.countryId}
                  onChange={handleCountryChange}
                  disabled={loadingCountries}
                >
                  <option value="">
                    {loadingCountries ? 'Loading Countries...' : 'Select Country'}
                  </option>
                  {countries.map((country) => (
                    <option key={country.id || country.code || country.name} value={country.id}>
                      {country.name || country.code}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                State / Province
                <select
                  name="stateId"
                  value={form.stateId}
                  onChange={handleStateChange}
                  disabled={!form.countryId || loadingStates}
                >
                  <option value="">
                    {!form.countryId
                      ? 'Select Country First'
                      : loadingStates
                        ? 'Loading States...'
                        : 'Select State'}
                  </option>
                  {states.map((state) => (
                    <option key={state.id || state.name} value={state.id}>
                      {state.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label>
              City
              <select
                name="cityId"
                value={form.cityId}
                onChange={handleCityChange}
                disabled={!form.stateId || loadingCities}
              >
                <option value="">
                  {!form.stateId
                    ? 'Select State First'
                    : loadingCities
                      ? 'Loading Cities...'
                      : 'Select City'}
                </option>
                {cities.map((city) => (
                  <option key={city.id || city.name} value={city.id}>
                    {city.name}
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