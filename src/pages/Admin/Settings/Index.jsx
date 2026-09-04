/**
 * @file Admin/Settings/Index.jsx
 * @description Hotel configuration dashboard for general property settings
 * and architectural room mapping.
 * @figmaFrame Refined Hotel Configuration Dashboard
 */

import React, { useEffect, useMemo, useState } from 'react';
import Button from '@components/Button/Button';
import { lookupService } from '@services/lookupService';
import { orgTypeService } from '@services/orgTypeService';
import { userService } from '@services/userService';
import styles from './Index.module.css';

const ROOM_TYPE_OPTIONS = ['2B', '3B', '4B', '5B'];

const INITIAL_ROOMS = [
  { room: '101', type: '2B' },
  { room: '102', type: '2B' },
  { room: '103', type: '3B' },
  { room: '104', type: '2B' },
  { room: '105', type: '4B' },
  { room: '106', type: '2B' },
  { room: '107', type: '2B' },
  { room: '201', type: '3B' },
  { room: '202', type: '3B' },
  { room: '203', type: '5B' },
  { room: '204', type: '3B' },
  { room: '205', type: '2B' },
  { room: '206', type: '2B' },
  { room: '207', type: '3B' },
  { room: '301', type: '4B' },
  { room: '302', type: '4B' },
  { room: '303', type: '5B' },
  { room: '304', type: '2B' },
  { room: '305', type: '3B' },
  { room: '306', type: '2B' },
  { room: '307', type: '2B' },
];

function RoomMappingCard({ room, onChange }) {
  return (
    <article className={styles.roomCard}>
      <strong className={styles.roomNumber}>
        Room {room.room}
      </strong>

      <select
        className={styles.roomTypeSelect}
        value={room.type}
        onChange={(event) => onChange(room.room, event.target.value)}
        aria-label={`Room ${room.room} type`}
      >
        {ROOM_TYPE_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </article>
  );
}

export default function AdminSettingsPage() {
  const getStoredSettings = () => {
    try {
      const stored = localStorage.getItem('syncstays_admin_settings');

      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to load settings:', e);
    }

    return null;
  };

  const [hotelName, setHotelName] = useState(() => {
    const settings = getStoredSettings();
    return settings?.hotelName || 'Grand Hotel Group';
  });

  const [taxRate, setTaxRate] = useState(() => {
    const settings = getStoredSettings();
    return settings?.taxRate ? String(settings.taxRate) : '12.5';
  });

  const [currency, setCurrency] = useState(() => {
    const settings = getStoredSettings();
    return settings?.currency || 'USD';
  });

  const [currencyList, setCurrencyList] = useState([
    { code: 'USD', symbol: '$' },
    { code: 'EUR', symbol: '€' },
    { code: 'GBP', symbol: '£' },
    { code: 'INR', symbol: '₹' },
  ]);

  const [orgTypes, setOrgTypes] = useState([
    {
      id: 1,
      typeName: 'Hotel',
      description: 'Lodging properties',
    },
    {
      id: 2,
      typeName: 'Restaurant',
      description: 'Standalone F&B',
    },
    {
      id: 3,
      typeName: 'Hotel + Restaurant',
      description: 'Combined property',
    },
  ]);

  const [newTypeName, setNewTypeName] = useState('');
  const [newTypeDesc, setNewTypeDesc] = useState('');
  const [showOrgTypeModal, setShowOrgTypeModal] = useState(false);

  const [rooms, setRooms] = useState(() => {
    const settings = getStoredSettings();
    return settings?.rooms || INITIAL_ROOMS;
  });

  const [saved, setSaved] = useState(false);

  // Regional & Currency Activation State
  const [activationTab, setActivationTab] = useState('countries'); // 'countries' | 'states' | 'cities' | 'currencies'
  const [actCountries, setActCountries] = useState([]);
  const [actStates, setActStates] = useState([]);
  const [actCities, setActCities] = useState([]);
  const [actCurrencies, setActCurrencies] = useState([]);

  // Hierarchical Selectors (States & Cities tabs)
  const [selectedActCountryId, setSelectedActCountryId] = useState('');
  const [selectedActStateId, setSelectedActStateId] = useState('');
  const [hierarchyStates, setHierarchyStates] = useState([]);

  // Search, Filter, Pagination, Selection
  const [activationSearch, setActivationSearch] = useState('');
  const [activationStatusFilter, setActivationStatusFilter] = useState('all'); // 'all' | 'inactive' | 'active'
  const [activationPage, setActivationPage] = useState(1);
  const [selectedActivationIds, setSelectedActivationIds] = useState(new Set());

  // Loading & Feedback
  const [actLoading, setActLoading] = useState(false);
  const [actHierarchyLoading, setActHierarchyLoading] = useState(false);
  const [activating, setActivating] = useState(false);
  const [actFeedback, setActFeedback] = useState(null); // { type: 'success' | 'error', message: string }

  // Security / Change Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Helper to determine if an entity is active
  const isItemActive = (item, tab) => {
    if (!item) return false;
    if (tab === 'currencies') {
      return item.status === 'active' || item.isActive === true;
    }
    return Boolean(item.isActive === true || item.isActive === 1 || item.status === 'active');
  };

  // Data Fetchers for Master Lookups
  const fetchAllCountries = async () => {
    setActLoading(true);
    try {
      const res = await lookupService.getCountries({
        fetchAll: 'true',
        getAllCountry: 'true',
      });
      const list =
        res?.data?.responses ||
        res?.data?.rows ||
        res?.data?.data ||
        (Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : []);
      setActCountries(Array.isArray(list) ? list : []);
    } catch (err) {
      console.warn('Failed to load countries for activation:', err);
      setActCountries([]);
    } finally {
      setActLoading(false);
    }
  };

  const fetchStatesForCountry = async (countryId) => {
    if (!countryId) {
      setActStates([]);
      return;
    }
    setActLoading(true);
    try {
      const res = await lookupService.getStates(countryId, {
        fetchAll: 'true',
        getAllState: 'true',
      });
      const list =
        res?.data?.responses ||
        res?.data?.rows ||
        res?.data?.data ||
        (Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : []);
      setActStates(Array.isArray(list) ? list : []);
    } catch (err) {
      console.warn('Failed to load states for activation:', err);
      setActStates([]);
    } finally {
      setActLoading(false);
    }
  };

  const fetchHierarchyStatesForCityTab = async (countryId) => {
    if (!countryId) {
      setHierarchyStates([]);
      return;
    }
    setActHierarchyLoading(true);
    try {
      const res = await lookupService.getStates(countryId, {
        fetchAll: 'true',
        getAllState: 'true',
      });
      const list =
        res?.data?.responses ||
        res?.data?.rows ||
        res?.data?.data ||
        (Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : []);
      setHierarchyStates(Array.isArray(list) ? list : []);
    } catch (err) {
      console.warn('Failed to load hierarchy states for cities tab:', err);
      setHierarchyStates([]);
    } finally {
      setActHierarchyLoading(false);
    }
  };

  const fetchCitiesForState = async (stateId) => {
    if (!stateId) {
      setActCities([]);
      return;
    }
    setActLoading(true);
    try {
      const res = await lookupService.getCities(stateId, {
        fetchAll: 'true',
        getAllCity: 'true',
      });
      const list =
        res?.data?.responses ||
        res?.data?.rows ||
        res?.data?.data ||
        (Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : []);
      setActCities(Array.isArray(list) ? list : []);
    } catch (err) {
      console.warn('Failed to load cities for activation:', err);
      setActCities([]);
    } finally {
      setActLoading(false);
    }
  };

  const fetchAllCurrencies = async () => {
    setActLoading(true);
    try {
      const res = await lookupService.getCurrencies({
        fetchAll: 'true',
        getAllCurrency: 'true',
      });
      const list =
        res?.data?.responses ||
        res?.data?.rows ||
        res?.data?.data ||
        (Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : []);
      setActCurrencies(Array.isArray(list) ? list : []);
    } catch (err) {
      console.warn('Failed to load currencies for activation:', err);
      setActCurrencies([]);
    } finally {
      setActLoading(false);
    }
  };

  const handleTabChange = (nextTab) => {
    setActivationTab(nextTab);
    setActivationSearch('');
    setActivationStatusFilter('all');
    setActivationPage(1);
    setSelectedActivationIds(new Set());
    setActFeedback(null);

    if (nextTab === 'countries') {
      if (actCountries.length === 0) {
        fetchAllCountries();
      }
    } else if (nextTab === 'states') {
      if (actCountries.length === 0) {
        fetchAllCountries();
      }
      if (selectedActCountryId) {
        fetchStatesForCountry(selectedActCountryId);
      }
    } else if (nextTab === 'cities') {
      if (actCountries.length === 0) {
        fetchAllCountries();
      }
      if (selectedActCountryId && hierarchyStates.length === 0) {
        fetchHierarchyStatesForCityTab(selectedActCountryId);
      }
      if (selectedActStateId) {
        fetchCitiesForState(selectedActStateId);
      }
    } else if (nextTab === 'currencies') {
      if (actCurrencies.length === 0) {
        fetchAllCurrencies();
      }
    }
  };

  const handleActCountryChangeForStates = (event) => {
    const countryId = event.target.value;
    setSelectedActCountryId(countryId);
    setActivationPage(1);
    setActivationSearch('');
    setSelectedActivationIds(new Set());
    setActFeedback(null);
    if (countryId) {
      fetchStatesForCountry(countryId);
    } else {
      setActStates([]);
    }
  };

  const handleActCountryChangeForCities = (event) => {
    const countryId = event.target.value;
    setSelectedActCountryId(countryId);
    setSelectedActStateId('');
    setHierarchyStates([]);
    setActCities([]);
    setActivationPage(1);
    setActivationSearch('');
    setSelectedActivationIds(new Set());
    setActFeedback(null);
    if (countryId) {
      fetchHierarchyStatesForCityTab(countryId);
    }
  };

  const handleActStateChangeForCities = (event) => {
    const stateId = event.target.value;
    setSelectedActStateId(stateId);
    setActivationPage(1);
    setActivationSearch('');
    setSelectedActivationIds(new Set());
    setActFeedback(null);
    if (stateId) {
      fetchCitiesForState(stateId);
    } else {
      setActCities([]);
    }
  };

  // Selection handlers
  const handleToggleSelectId = (id) => {
    setSelectedActivationIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Filtered dataset for active tab
  const filteredActivationItems = useMemo(() => {
    let items = [];
    if (activationTab === 'countries') items = actCountries;
    else if (activationTab === 'states') items = actStates;
    else if (activationTab === 'cities') items = actCities;
    else if (activationTab === 'currencies') items = actCurrencies;

    const term = activationSearch.trim().toLowerCase();

    return items.filter((item) => {
      const active = isItemActive(item, activationTab);
      if (activationStatusFilter === 'active' && !active) return false;
      if (activationStatusFilter === 'inactive' && active) return false;

      if (!term) return true;

      if (activationTab === 'countries') {
        const name = (item.name || '').toLowerCase();
        const iso = (item.isoCode || item.iso2 || item.iso3 || item.code || '').toLowerCase();
        const phone = (item.phonecode || '').toLowerCase();
        return name.includes(term) || iso.includes(term) || phone.includes(term);
      }
      if (activationTab === 'states') {
        const name = (item.name || '').toLowerCase();
        return name.includes(term);
      }
      if (activationTab === 'cities') {
        const name = (item.name || '').toLowerCase();
        return name.includes(term);
      }
      if (activationTab === 'currencies') {
        const name = (item.name || '').toLowerCase();
        const code = (item.code || '').toLowerCase();
        const symbol = (item.symbol || '').toLowerCase();
        return name.includes(term) || code.includes(term) || symbol.includes(term);
      }
      return true;
    });
  }, [
    activationTab,
    actCountries,
    actStates,
    actCities,
    actCurrencies,
    activationSearch,
    activationStatusFilter,
  ]);

  const ITEMS_PER_PAGE = 12;
  const totalPages = Math.max(1, Math.ceil(filteredActivationItems.length / ITEMS_PER_PAGE));
  const paginatedActivationItems = useMemo(() => {
    const start = (activationPage - 1) * ITEMS_PER_PAGE;
    return filteredActivationItems.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredActivationItems, activationPage]);

  const inactiveFilteredItems = useMemo(() => {
    return filteredActivationItems.filter((item) => !isItemActive(item, activationTab));
  }, [filteredActivationItems, activationTab]);

  const allInactiveSelected =
    inactiveFilteredItems.length > 0 &&
    inactiveFilteredItems.every((item) => selectedActivationIds.has(item.id));

  const handleToggleSelectAll = () => {
    if (allInactiveSelected) {
      // Deselect all inactive in current filtered list
      setSelectedActivationIds((prev) => {
        const next = new Set(prev);
        inactiveFilteredItems.forEach((item) => next.delete(item.id));
        return next;
      });
    } else {
      // Select all inactive in current filtered list
      setSelectedActivationIds((prev) => {
        const next = new Set(prev);
        inactiveFilteredItems.forEach((item) => next.add(item.id));
        return next;
      });
    }
  };

  // Execution: Batch or Quick Activate
  const executeActivation = async (ids) => {
    if (!ids || ids.length === 0) return;
    setActivating(true);
    setActFeedback(null);
    try {
      let res;
      if (activationTab === 'countries') {
        res = await lookupService.updateCountry({ ids });
      } else if (activationTab === 'states') {
        res = await lookupService.updateState({ ids });
      } else if (activationTab === 'cities') {
        res = await lookupService.updateCity({ ids });
      } else if (activationTab === 'currencies') {
        res = await lookupService.updateCurrency({ ids });
      }

      if (res && (res.status === 200 || res.success || res.message)) {
        setActFeedback({
          type: 'success',
          message: res.message || `Successfully activated ${ids.length} item(s)!`,
        });

        setSelectedActivationIds((prev) => {
          const next = new Set(prev);
          ids.forEach((id) => next.delete(id));
          return next;
        });

        if (activationTab === 'countries') {
          await fetchAllCountries();
        } else if (activationTab === 'states') {
          if (selectedActCountryId) {
            await fetchStatesForCountry(selectedActCountryId);
          }
        } else if (activationTab === 'cities') {
          if (selectedActStateId) {
            await fetchCitiesForState(selectedActStateId);
          }
        } else if (activationTab === 'currencies') {
          await fetchAllCurrencies();
          try {
            const curRes = await lookupService.getCurrencies();
            const curList =
              curRes?.data?.responses ||
              curRes?.data?.rows ||
              curRes?.data?.data ||
              (Array.isArray(curRes?.data) ? curRes.data : []);
            if (Array.isArray(curList) && curList.length > 0) {
              setCurrencyList(curList);
            }
          } catch {
            // ignore
          }
        }
      } else {
        setActFeedback({
          type: 'error',
          message: res?.message || 'Failed to activate selected items.',
        });
      }
    } catch (err) {
      setActFeedback({
        type: 'error',
        message: err.message || 'Error occurred while activating items.',
      });
    } finally {
      setActivating(false);
    }
  };

  const handleBatchActivate = () => {
    if (selectedActivationIds.size === 0) return;
    executeActivation(Array.from(selectedActivationIds));
  };

  const handleQuickActivate = (id) => {
    executeActivation([id]);
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();
    setPasswordSuccess('');
    setPasswordError('');

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirm password do not match.');
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await userService.changePassword(currentPassword, newPassword);
      setPasswordLoading(false);
      if (res.success || res.status === 200) {
        setPasswordSuccess(res.message || 'Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordError(res.message || 'Failed to change password. Please verify current password.');
      }
    } catch (err) {
      setPasswordLoading(false);
      setPasswordError(err.message || 'Error changing password.');
    }
  };

  useEffect(() => {
    async function loadData() {
      try {
        const res = await lookupService.getCurrencies();

        const curList =
          res?.data?.responses ||
          res?.data?.rows ||
          res?.data?.data ||
          (Array.isArray(res?.data)
            ? res.data
            : Array.isArray(res)
              ? res
              : []);

        if (Array.isArray(curList) && curList.length > 0) {
          setCurrencyList(curList);
        }
      } catch (err) {
        console.warn(
          'Currency lookup API offline, using defaults.',
          err,
        );
      }

      try {
        const resOrg = await orgTypeService.getAll();

        const otList =
          resOrg?.data?.responses ||
          resOrg?.data?.rows ||
          resOrg?.data?.data ||
          (Array.isArray(resOrg?.data)
            ? resOrg.data
            : Array.isArray(resOrg)
              ? resOrg
              : []);

        if (Array.isArray(otList) && otList.length > 0) {
          setOrgTypes(otList);
        }
      } catch (err) {
        console.warn(
          'Org types API offline, using defaults.',
          err,
        );
      }

      // Initial preload for countries in activation tab
      fetchAllCountries();
    }

    loadData();
  }, []);

  const roomTypeCounts = useMemo(() => {
    return rooms.reduce((accumulator, room) => {
      accumulator[room.type] =
        (accumulator[room.type] || 0) + 1;

      return accumulator;
    }, {});
  }, [rooms]);

  const updateRoomType = (roomNumber, nextType) => {
    setRooms((currentRooms) =>
      currentRooms.map((room) =>
        room.room === roomNumber
          ? {
            ...room,
            type: nextType,
          }
          : room,
      ),
    );

    setSaved(false);
  };

  const handleSave = () => {
    const configuration = {
      hotelName,
      taxRate: Number(taxRate),
      currency,
      rooms,
    };

    try {
      localStorage.setItem(
        'syncstays_admin_settings',
        JSON.stringify(configuration),
      );

      console.log(
        'Hotel configuration saved:',
        configuration,
      );

      setSaved(true);
    } catch (e) {
      console.error(
        'Failed to save settings:',
        e,
      );
    }
  };

  const handleExport = () => {
    const configuration = {
      hotelName,
      taxRate,
      currency,
      rooms,
    };

    const blob = new globalThis.Blob(
      [JSON.stringify(configuration, null, 2)],
      {
        type: 'application/json',
      },
    );

    const url = globalThis.URL.createObjectURL(blob);
    const anchor = document.createElement('a');

    anchor.href = url;
    anchor.download = 'hotel-configuration.json';
    anchor.click();

    globalThis.URL.revokeObjectURL(url);
  };

  const handleDeleteOrgType = async (orgType) => {
    if (
      !window.confirm(
        'Delete this organization type?',
      )
    ) {
      return;
    }

    try {
      await orgTypeService.delete(orgType.id);
    } catch (e) {
      console.warn(
        'Org type delete fallback:',
        e,
      );
    }

    setOrgTypes((prev) =>
      prev.filter(
        (item) => item.id !== orgType.id,
      ),
    );
  };

  const handleCreateOrgType = async (event) => {
    event.preventDefault();

    const payload = {
      typeName: newTypeName.trim(),
      description: newTypeDesc.trim(),
    };

    if (!payload.typeName) {
      return;
    }

    try {
      const res = await orgTypeService.create(
        payload,
      );

      if (res && res.data) {
        setOrgTypes((prev) => [
          ...prev,
          res.data,
        ]);
      } else {
        setOrgTypes((prev) => [
          ...prev,
          {
            ...payload,
            id: Date.now(),
          },
        ]);
      }
    } catch (err) {
      console.warn(
        'Org type create API offline, using fallback:',
        err,
      );

      setOrgTypes((prev) => [
        ...prev,
        {
          ...payload,
          id: Date.now(),
        },
      ]);
    }

    setShowOrgTypeModal(false);
    setNewTypeName('');
    setNewTypeDesc('');
  };

  return (
    <div
      className={styles.page}
      data-testid="admin-settings-page"
    >
      <div className={styles.breadcrumb}>
        <span>Settings</span>
        <span>/</span>
        <strong>Configuration</strong>
      </div>

      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>
            Hotel Configuration
          </h1>

          <p className={styles.subtitle}>
            Adjust global settings and room architectural
            mappings.
          </p>
        </div>

        <div className={styles.headerActions}>
          <Button
            variant="secondary"
            onClick={handleExport}
          >
            Export
          </Button>

          <Button
            variant="primary"
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </div>
      </header>

      <section className={styles.configurationCard}>
        {/* =========================
            GENERAL INFORMATION
        ========================= */}

        <div className={styles.section}>
          <div className={styles.sectionHeading}>
            <span className={styles.sectionAccent} />

            <h2>General Information</h2>
          </div>

          <div className={styles.generalGrid}>
            <div className={styles.fieldGroup}>
              <label
                htmlFor="hotel-name"
                className={styles.label}
              >
                Hotel Name
              </label>

              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>
                  ▧
                </span>

                <input
                  id="hotel-name"
                  type="text"
                  className={styles.input}
                  value={hotelName}
                  onChange={(event) => {
                    setHotelName(
                      event.target.value,
                    );
                    setSaved(false);
                  }}
                />
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label
                htmlFor="tax-rate"
                className={styles.label}
              >
                Default Tax Rate (%)
              </label>

              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>
                  %
                </span>

                <input
                  id="tax-rate"
                  type="number"
                  min="0"
                  step="0.1"
                  className={styles.input}
                  value={taxRate}
                  onChange={(event) => {
                    setTaxRate(
                      event.target.value,
                    );
                    setSaved(false);
                  }}
                />
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label
                htmlFor="currency-locale"
                className={styles.label}
              >
                Currency Locale
              </label>

              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>
                  ▣
                </span>

                <select
                  id="currency-locale"
                  className={styles.select}
                  value={currency}
                  onChange={(event) => {
                    setCurrency(
                      event.target.value,
                    );
                    setSaved(false);
                  }}
                >
                  {currencyList.map((cur) => (
                    <option
                      key={
                        cur.code ||
                        cur.id ||
                        cur
                      }
                      value={
                        cur.code ||
                        cur
                      }
                    >
                      {cur.code || cur} (
                      {cur.symbol || cur})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.divider} />

        {/* =========================
            ORGANIZATION TYPES
        ========================= */}

        <div className={styles.section}>
          <div className={styles.mappingHeader}>
            <div className={styles.sectionHeading}>
              <span
                className={styles.sectionAccent}
              />

              <h2>Organization Types</h2>
            </div>

            <Button
              variant="secondary"
              onClick={() =>
                setShowOrgTypeModal(true)
              }
            >
              + Add Org Type
            </Button>
          </div>

          <div className={styles.orgTypeGrid}>
            {orgTypes.map((orgType) => (
              <article
                key={
                  orgType.id ||
                  orgType.typeName
                }
                className={styles.orgTypeCard}
              >
                <div
                  className={
                    styles.orgTypeHeader
                  }
                >
                  <strong
                    className={
                      styles.orgTypeName
                    }
                  >
                    {orgType.typeName ||
                      orgType.name}
                  </strong>

                  <button
                    type="button"
                    className={
                      styles.orgTypeDelete
                    }
                    onClick={() =>
                      handleDeleteOrgType(
                        orgType,
                      )
                    }
                  >
                    Delete
                  </button>
                </div>

                <p
                  className={
                    styles.orgTypeDescription
                  }
                >
                  {orgType.description ||
                    'Property type'}
                </p>
              </article>
            ))}
          </div>

          {showOrgTypeModal && (
            <div
              className={
                styles.orgTypeModalOverlay
              }
              onClick={() =>
                setShowOrgTypeModal(false)
              }
            >
              <form
                className={
                  styles.orgTypeModal
                }
                onClick={(event) =>
                  event.stopPropagation()
                }
                onSubmit={
                  handleCreateOrgType
                }
              >
                <h3
                  className={
                    styles.orgTypeModalTitle
                  }
                >
                  Add Organization Type
                </h3>

                <label
                  className={
                    styles.orgTypeModalLabel
                  }
                >
                  Type Name

                  <input
                    required
                    type="text"
                    value={newTypeName}
                    onChange={(event) =>
                      setNewTypeName(
                        event.target.value,
                      )
                    }
                    placeholder="e.g. Resort, Boutique Hotel"
                    className={
                      styles.orgTypeModalInput
                    }
                  />
                </label>

                <label
                  className={
                    styles.orgTypeModalLabel
                  }
                >
                  Description

                  <input
                    type="text"
                    value={newTypeDesc}
                    onChange={(event) =>
                      setNewTypeDesc(
                        event.target.value,
                      )
                    }
                    placeholder="Short description"
                    className={
                      styles.orgTypeModalInput
                    }
                  />
                </label>

                <div
                  className={
                    styles.orgTypeModalActions
                  }
                >
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() =>
                      setShowOrgTypeModal(false)
                    }
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    variant="primary"
                  >
                    Create Type
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>

        <div className={styles.divider} />

        {/* =========================
            ARCHITECTURAL ROOM MAPPING
        ========================= */}

        <div className={styles.section}>
          <div className={styles.mappingHeader}>
            <div className={styles.sectionHeading}>
              <span
                className={styles.sectionAccent}
              />

              <h2>
                Architectural Room Mapping
              </h2>
            </div>

            <div className={styles.legend}>
              <span
                className={styles.legendItem}
              >
                <span
                  className={`${styles.legendDot} ${styles.standardDot}`}
                />
                2B Standard
              </span>

              <span
                className={styles.legendItem}
              >
                <span
                  className={`${styles.legendDot} ${styles.deluxeDot}`}
                />
                3B Deluxe
              </span>
            </div>
          </div>

          <div className={styles.roomGrid}>
            {rooms.map((room) => (
              <RoomMappingCard
                key={room.room}
                room={room}
                onChange={updateRoomType}
              />
            ))}
          </div>

          <div
            className={
              styles.overlayPreview
            }
          >
            <div
              className={
                styles.overlayHeader
              }
            >
              <span>
                Architecture Overlay Preview
              </span>

              <button
                type="button"
                className={
                  styles.expandButton
                }
                aria-label="Expand architecture preview"
              >
                ⤢
              </button>
            </div>

            <div
              className={
                styles.overlayCanvas
              }
            >
              <div
                className={
                  styles.previewContent
                }
              >
                <span
                  className={
                    styles.previewLabel
                  }
                >
                  Current Mapping
                </span>

                <strong>
                  {rooms.length} Rooms
                  Configured
                </strong>

                <div
                  className={
                    styles.previewStats
                  }
                >
                  {Object.entries(
                    roomTypeCounts,
                  ).map(
                    ([type, count]) => (
                      <span key={type}>
                        {type}: {count}
                      </span>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.saveArea}>
            <p
              className={styles.editNote}
            >
              Last edited by AT. Changes
              to tax rates will apply to
              all future reservations
              immediately.
            </p>

            <Button
              variant="primary"
              onClick={handleSave}
            >
              {saved
                ? 'Configuration Saved'
                : 'Save Configuration'}
            </Button>
          </div>
        </div>
      </section>

      {/* =========================
          REGIONAL & CURRENCY ACTIVATION
      ========================= */}
      <section className={styles.configurationCard} style={{ marginTop: 'var(--space-xl)' }}>
        <div className={styles.section}>
          <div className={styles.sectionHeading}>
            <span className={styles.sectionAccent} />
            <h2>Regional & Currency Activation</h2>
          </div>

          {actFeedback && (
            <div
              className={
                actFeedback.type === 'success'
                  ? styles.feedbackSuccess
                  : styles.feedbackError
              }
            >
              <span>{actFeedback.type === 'success' ? '✓' : '⚠'}</span>
              <span>{actFeedback.message}</span>
            </div>
          )}

          {/* Sub Tabs */}
          <div className={styles.activationTabsContainer}>
            <div className={styles.subTabsList}>
              <button
                type="button"
                className={`${styles.subTabButton} ${
                  activationTab === 'countries' ? styles.subTabButtonActive : ''
                }`}
                onClick={() => handleTabChange('countries')}
              >
                <span>Countries</span>
                <span className={styles.tabBadge}>
                  {actCountries.length > 0 ? actCountries.length : '0'}
                </span>
              </button>

              <button
                type="button"
                className={`${styles.subTabButton} ${
                  activationTab === 'states' ? styles.subTabButtonActive : ''
                }`}
                onClick={() => handleTabChange('states')}
              >
                <span>States</span>
                {actStates.length > 0 && (
                  <span className={styles.tabBadge}>{actStates.length}</span>
                )}
              </button>

              <button
                type="button"
                className={`${styles.subTabButton} ${
                  activationTab === 'cities' ? styles.subTabButtonActive : ''
                }`}
                onClick={() => handleTabChange('cities')}
              >
                <span>Cities</span>
                {actCities.length > 0 && (
                  <span className={styles.tabBadge}>{actCities.length}</span>
                )}
              </button>

              <button
                type="button"
                className={`${styles.subTabButton} ${
                  activationTab === 'currencies' ? styles.subTabButtonActive : ''
                }`}
                onClick={() => handleTabChange('currencies')}
              >
                <span>Currencies</span>
                <span className={styles.tabBadge}>
                  {actCurrencies.length > 0 ? actCurrencies.length : '0'}
                </span>
              </button>
            </div>
          </div>

          {/* Hierarchy Selectors for States / Cities */}
          {activationTab === 'states' && (
            <div className={styles.hierarchyGroup}>
              <div className={styles.hierarchyItem}>
                <label htmlFor="states-country-select" className={styles.hierarchyLabel}>
                  Select Country to Browse States
                </label>
                <select
                  id="states-country-select"
                  className={styles.filterSelect}
                  value={selectedActCountryId}
                  onChange={handleActCountryChangeForStates}
                >
                  <option value="">-- Choose Country --</option>
                  {actCountries.map((c) => (
                    <option key={c.id || c.name} value={c.id}>
                      {c.name} {c.isoCode || c.iso2 ? `(${c.isoCode || c.iso2})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {activationTab === 'cities' && (
            <div className={styles.hierarchyGroup}>
              <div className={styles.hierarchyItem}>
                <label htmlFor="cities-country-select" className={styles.hierarchyLabel}>
                  Step 1: Select Country
                </label>
                <select
                  id="cities-country-select"
                  className={styles.filterSelect}
                  value={selectedActCountryId}
                  onChange={handleActCountryChangeForCities}
                >
                  <option value="">-- Choose Country --</option>
                  {actCountries.map((c) => (
                    <option key={c.id || c.name} value={c.id}>
                      {c.name} {c.isoCode || c.iso2 ? `(${c.isoCode || c.iso2})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.hierarchyItem}>
                <label htmlFor="cities-state-select" className={styles.hierarchyLabel}>
                  Step 2: Select State / Province
                </label>
                <select
                  id="cities-state-select"
                  className={styles.filterSelect}
                  value={selectedActStateId}
                  onChange={handleActStateChangeForCities}
                  disabled={!selectedActCountryId || actHierarchyLoading}
                >
                  <option value="">
                    {!selectedActCountryId
                      ? '-- Select Country First --'
                      : actHierarchyLoading
                      ? 'Loading States...'
                      : '-- Choose State --'}
                  </option>
                  {hierarchyStates.map((s) => (
                    <option key={s.id || s.name} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Search, Filter & Batch Action Toolbar */}
          <div className={styles.activationToolbar}>
            <div className={styles.toolbarFilters}>
              <div className={styles.searchBox}>
                <span className={styles.searchIcon}>🔍</span>
                <input
                  type="text"
                  className={styles.searchInput}
                  placeholder={
                    activationTab === 'countries'
                      ? 'Search country name or code...'
                      : activationTab === 'states'
                      ? 'Search state name...'
                      : activationTab === 'cities'
                      ? 'Search city name...'
                      : 'Search currency name, code or symbol...'
                  }
                  value={activationSearch}
                  onChange={(e) => {
                    setActivationSearch(e.target.value);
                    setActivationPage(1);
                  }}
                />
              </div>

              <select
                className={styles.filterSelect}
                value={activationStatusFilter}
                onChange={(e) => {
                  setActivationStatusFilter(e.target.value);
                  setActivationPage(1);
                }}
                aria-label="Filter by activation status"
              >
                <option value="all">All Statuses</option>
                <option value="inactive">Inactive Only</option>
                <option value="active">Active Only</option>
              </select>
            </div>

            <div className={styles.toolbarActions}>
              {selectedActivationIds.size > 0 && (
                <div className={styles.selectionIndicator}>
                  <span>Selected:</span>
                  <span className={styles.selectionCount}>
                    {selectedActivationIds.size}
                  </span>
                </div>
              )}

              <Button
                variant="primary"
                onClick={handleBatchActivate}
                disabled={selectedActivationIds.size === 0 || activating}
              >
                {activating
                  ? 'Activating...'
                  : selectedActivationIds.size > 0
                  ? `Activate Selected (${selectedActivationIds.size})`
                  : 'Activate Selected'}
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className={styles.tableResponsive}>
            <table className={styles.activationTable}>
              <thead>
                <tr>
                  <th className={styles.checkboxCol}>
                    <input
                      type="checkbox"
                      className={styles.itemCheckbox}
                      checked={allInactiveSelected}
                      disabled={inactiveFilteredItems.length === 0 || actLoading}
                      onChange={handleToggleSelectAll}
                      title="Select all inactive items"
                      aria-label="Select all inactive items"
                    />
                  </th>
                  {activationTab === 'countries' && (
                    <>
                      <th>Country Name</th>
                      <th>ISO / Code</th>
                      <th>Phone Code</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Action</th>
                    </>
                  )}
                  {activationTab === 'states' && (
                    <>
                      <th>State Name</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Action</th>
                    </>
                  )}
                  {activationTab === 'cities' && (
                    <>
                      <th>City Name</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Action</th>
                    </>
                  )}
                  {activationTab === 'currencies' && (
                    <>
                      <th>Currency Name</th>
                      <th>Code</th>
                      <th>Symbol</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Action</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {actLoading ? (
                  <tr>
                    <td colSpan={6} className={styles.tableEmptyMessage}>
                      <div className={styles.emptyStateTitle}>Loading Master Records...</div>
                      <p>Fetching data from lookup service</p>
                    </td>
                  </tr>
                ) : activationTab === 'states' && !selectedActCountryId ? (
                  <tr>
                    <td colSpan={6} className={styles.tableEmptyMessage}>
                      <div className={styles.emptyStateTitle}>No Country Selected</div>
                      <p>Please choose a country from the dropdown above to view and activate its states.</p>
                    </td>
                  </tr>
                ) : activationTab === 'cities' && (!selectedActCountryId || !selectedActStateId) ? (
                  <tr>
                    <td colSpan={6} className={styles.tableEmptyMessage}>
                      <div className={styles.emptyStateTitle}>
                        {!selectedActCountryId
                          ? 'No Country Selected'
                          : 'No State Selected'}
                      </div>
                      <p>
                        {!selectedActCountryId
                          ? 'Please select a country, then a state above to view and activate cities.'
                          : 'Please choose a state from the dropdown above to view and activate its cities.'}
                      </p>
                    </td>
                  </tr>
                ) : paginatedActivationItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className={styles.tableEmptyMessage}>
                      <div className={styles.emptyStateTitle}>No Records Found</div>
                      <p>No matching items found for the selected filters.</p>
                    </td>
                  </tr>
                ) : (
                  paginatedActivationItems.map((item) => {
                    const active = isItemActive(item, activationTab);
                    const isSelected = selectedActivationIds.has(item.id);

                    return (
                      <tr key={item.id || item.code || item.name}>
                        <td className={styles.checkboxCol}>
                          <input
                            type="checkbox"
                            className={styles.itemCheckbox}
                            checked={isSelected}
                            disabled={active || activating}
                            onChange={() => handleToggleSelectId(item.id)}
                            title={active ? 'Already Active' : 'Select for activation'}
                            aria-label={`Select ${item.name || item.code}`}
                          />
                        </td>

                        {activationTab === 'countries' && (
                          <>
                            <td>
                              <div className={styles.itemNameCol}>
                                {item.flag && item.flag.length <= 4 ? (
                                  <span className={styles.flagEmoji}>{item.flag}</span>
                                ) : null}
                                <span>{item.name}</span>
                              </div>
                            </td>
                            <td>
                              <span className={styles.codeBadge}>
                                {item.isoCode || item.iso2 || item.iso3 || item.code || '—'}
                              </span>
                            </td>
                            <td>
                              <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                                {item.phonecode || item.phoneCode ? `+${item.phonecode || item.phoneCode}` : '—'}
                              </span>
                            </td>
                            <td>
                              <span
                                className={`${styles.statusBadge} ${
                                  active ? styles.statusBadgeActive : styles.statusBadgeInactive
                                }`}
                              >
                                {active ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              {!active ? (
                                <button
                                  type="button"
                                  className={styles.quickActivateButton}
                                  onClick={() => handleQuickActivate(item.id)}
                                  disabled={activating}
                                >
                                  Activate
                                </button>
                              ) : (
                                <span className={styles.alreadyActiveText}>Active</span>
                              )}
                            </td>
                          </>
                        )}

                        {activationTab === 'states' && (
                          <>
                            <td>
                              <strong>{item.name}</strong>
                            </td>
                            <td>
                              <span
                                className={`${styles.statusBadge} ${
                                  active ? styles.statusBadgeActive : styles.statusBadgeInactive
                                }`}
                              >
                                {active ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              {!active ? (
                                <button
                                  type="button"
                                  className={styles.quickActivateButton}
                                  onClick={() => handleQuickActivate(item.id)}
                                  disabled={activating}
                                >
                                  Activate
                                </button>
                              ) : (
                                <span className={styles.alreadyActiveText}>Active</span>
                              )}
                            </td>
                          </>
                        )}

                        {activationTab === 'cities' && (
                          <>
                            <td>
                              <strong>{item.name}</strong>
                            </td>
                            <td>
                              <span
                                className={`${styles.statusBadge} ${
                                  active ? styles.statusBadgeActive : styles.statusBadgeInactive
                                }`}
                              >
                                {active ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              {!active ? (
                                <button
                                  type="button"
                                  className={styles.quickActivateButton}
                                  onClick={() => handleQuickActivate(item.id)}
                                  disabled={activating}
                                >
                                  Activate
                                </button>
                              ) : (
                                <span className={styles.alreadyActiveText}>Active</span>
                              )}
                            </td>
                          </>
                        )}

                        {activationTab === 'currencies' && (
                          <>
                            <td>
                              <strong>{item.name}</strong>
                            </td>
                            <td>
                              <span className={styles.codeBadge}>{item.code || '—'}</span>
                            </td>
                            <td>
                              <span style={{ fontSize: '13px', fontWeight: 600 }}>
                                {item.symbol || '—'}
                              </span>
                            </td>
                            <td>
                              <span
                                className={`${styles.statusBadge} ${
                                  active ? styles.statusBadgeActive : styles.statusBadgeInactive
                                }`}
                              >
                                {active ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              {!active ? (
                                <button
                                  type="button"
                                  className={styles.quickActivateButton}
                                  onClick={() => handleQuickActivate(item.id)}
                                  disabled={activating}
                                >
                                  Activate
                                </button>
                              ) : (
                                <span className={styles.alreadyActiveText}>Active</span>
                              )}
                            </td>
                          </>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {filteredActivationItems.length > 0 && (
            <div className={styles.paginationBar}>
              <span>
                Showing{' '}
                <strong>
                  {Math.min(
                    (activationPage - 1) * ITEMS_PER_PAGE + 1,
                    filteredActivationItems.length
                  )}
                </strong>{' '}
                to{' '}
                <strong>
                  {Math.min(
                    activationPage * ITEMS_PER_PAGE,
                    filteredActivationItems.length
                  )}
                </strong>{' '}
                of <strong>{filteredActivationItems.length}</strong> entries
              </span>

              <div className={styles.paginationButtons}>
                <button
                  type="button"
                  className={styles.pageNavBtn}
                  onClick={() => setActivationPage((p) => Math.max(1, p - 1))}
                  disabled={activationPage === 1}
                >
                  Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => {
                    if (totalPages <= 7) return true;
                    if (p === 1 || p === totalPages) return true;
                    return Math.abs(p - activationPage) <= 1;
                  })
                  .map((p, idx, arr) => {
                    const prevPage = arr[idx - 1];
                    const showEllipsis = prevPage && p - prevPage > 1;

                    return (
                      <React.Fragment key={p}>
                        {showEllipsis && <span style={{ padding: '0 4px' }}>...</span>}
                        <button
                          type="button"
                          className={`${styles.pageNavBtn} ${
                            activationPage === p ? styles.pageNavBtnActive : ''
                          }`}
                          onClick={() => setActivationPage(p)}
                        >
                          {p}
                        </button>
                      </React.Fragment>
                    );
                  })}

                <button
                  type="button"
                  className={styles.pageNavBtn}
                  onClick={() =>
                    setActivationPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={activationPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* =========================
          SECURITY & CHANGE PASSWORD
      ========================= */}
      <section className={styles.configurationCard} style={{ marginTop: 'var(--space-xl)' }}>
        <div className={styles.section}>
          <div className={styles.sectionHeading}>
            <span className={styles.sectionAccent} />
            <h2>Security & Password Change</h2>
          </div>

          {passwordSuccess && (
            <div style={{ color: 'var(--color-primary)', background: 'var(--color-primary-tint)', padding: '12px', borderRadius: '6px', marginBottom: '16px', fontSize: 'var(--font-size-sm)' }}>
              {passwordSuccess}
            </div>
          )}

          {passwordError && (
            <div style={{ color: 'var(--color-error)', background: 'rgba(239, 68, 68, 0.1)', padding: '12px', borderRadius: '6px', marginBottom: '16px', fontSize: 'var(--font-size-sm)' }}>
              {passwordError}
            </div>
          )}

          <form onSubmit={handleChangePassword} className={styles.generalGrid}>
            <div className={styles.fieldGroup}>
              <label htmlFor="current-password" className={styles.label}>
                Current Password
              </label>
              <div className={styles.inputWrapper} style={{ position: 'relative' }}>
                <span className={styles.inputIcon}>🔒</span>
                <input
                  id="current-password"
                  type={showCurrentPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={styles.input}
                  style={{ paddingRight: '40px' }}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  style={{ position: 'absolute', right: '10px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}
                  title={showCurrentPassword ? 'Hide Password' : 'Show Password'}
                >
                  {showCurrentPassword ? '👁️' : '🙈'}
                </button>
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="new-password" className={styles.label}>
                New Password
              </label>
              <div className={styles.inputWrapper} style={{ position: 'relative' }}>
                <span className={styles.inputIcon}>🔑</span>
                <input
                  id="new-password"
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={styles.input}
                  style={{ paddingRight: '40px' }}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  style={{ position: 'absolute', right: '10px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}
                  title={showNewPassword ? 'Hide Password' : 'Show Password'}
                >
                  {showNewPassword ? '👁️' : '🙈'}
                </button>
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="confirm-password" className={styles.label}>
                Confirm New Password
              </label>
              <div className={styles.inputWrapper} style={{ position: 'relative' }}>
                <span className={styles.inputIcon}>🔑</span>
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={styles.input}
                  style={{ paddingRight: '40px' }}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{ position: 'absolute', right: '10px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}
                  title={showConfirmPassword ? 'Hide Password' : 'Show Password'}
                >
                  {showConfirmPassword ? '👁️' : '🙈'}
                </button>
              </div>
            </div>

            <div className={styles.saveArea} style={{ gridColumn: '1 / -1', marginTop: 'var(--space-md)' }}>
              <Button variant="primary" type="submit" disabled={passwordLoading}>
                {passwordLoading ? 'Updating Password...' : 'Update Password'}
              </Button>
            </div>
          </form>
        </div>
      </section>

      <aside className={styles.adminNote}>
        <div className={styles.noteIcon}>
          i
        </div>

        <div>
          <span
            className={styles.noteTitle}
          >
            Administrator Note
          </span>

          <p>
            The room mapping grid is
            synced with the hotel&apos;s
            physical blueprint. Changing
            a room type here will affect
            pricing tiers and housekeeping
            assignment protocols across
            the platform. Use caution when
            reclassifying occupied rooms.
          </p>
        </div>
      </aside>
    </div>
  );
}