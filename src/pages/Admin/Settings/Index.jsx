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
import { organizationService } from '@services/organizationService';
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
  const [editingOrgType, setEditingOrgType] = useState(null);
  const [activeOrgId, setActiveOrgId] = useState(() => {
    return localStorage.getItem('syncstays_org_id') || null;
  });

  const [rooms, setRooms] = useState(() => {
    const settings = getStoredSettings();
    return settings?.rooms || INITIAL_ROOMS;
  });

  const [saved, setSaved] = useState(false);

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

      try {
        const orgRes = await organizationService.getAll();
        const list =
          orgRes?.data?.rows ||
          orgRes?.data?.responses ||
          orgRes?.data?.data ||
          (Array.isArray(orgRes?.data) ? orgRes.data : Array.isArray(orgRes) ? orgRes : []);

        if (Array.isArray(list) && list.length > 0) {
          const currentOrg = list[0];
          if (currentOrg.id) {
            setActiveOrgId(currentOrg.id);
            localStorage.setItem('syncstays_org_id', currentOrg.id);
          }
          if (currentOrg.name && !localStorage.getItem('syncstays_admin_settings')) {
            setHotelName(currentOrg.name);
          }
        }
      } catch (err) {
        console.warn('Organization API offline, using cached settings.', err);
      }
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

    if (activeOrgId) {
      organizationService.update(activeOrgId, { name: hotelName }).catch((err) => {
        console.warn('Could not update organization name on backend:', err);
      });
    }

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

  const openEditOrgType = async (orgType) => {
    setEditingOrgType(orgType);
    const initialName = orgType.type || orgType.typeName || orgType.name || '';
    setNewTypeName(initialName);
    setNewTypeDesc(orgType.description || '');
    setShowOrgTypeModal(true);

    if (orgType.id) {
      try {
        const res = await orgTypeService.getById(orgType.id);
        const fresh = res?.data || res;
        if (fresh?.type || fresh?.typeName) {
          setNewTypeName(fresh.type || fresh.typeName);
        }
      } catch (err) {
        console.warn('Could not fetch fresh org type details:', err);
      }
    }
  };

  const handleSaveOrgType = async (event) => {
    event.preventDefault();

    const typeStr = newTypeName.trim();
    if (!typeStr) return;

    const payload = {
      type: typeStr,
      typeName: typeStr,
      description: newTypeDesc.trim(),
    };

    if (editingOrgType) {
      try {
        const res = await orgTypeService.update(editingOrgType.id, payload);
        const updated = res?.data || { ...editingOrgType, ...payload };
        setOrgTypes((prev) =>
          prev.map((item) =>
            item.id === editingOrgType.id
              ? { ...item, ...updated, type: typeStr, typeName: typeStr }
              : item
          )
        );
      } catch (err) {
        console.warn('Org type update fallback:', err);
        setOrgTypes((prev) =>
          prev.map((item) =>
            item.id === editingOrgType.id ? { ...item, ...payload } : item
          )
        );
      }
    } else {
      try {
        const res = await orgTypeService.create(payload);
        if (res && res.data) {
          setOrgTypes((prev) => [...prev, res.data]);
        } else {
          setOrgTypes((prev) => [
            ...prev,
            { ...payload, id: Date.now() },
          ]);
        }
      } catch (err) {
        console.warn(
          'Org type create API offline, using fallback:',
          err,
        );
        setOrgTypes((prev) => [
          ...prev,
          { ...payload, id: Date.now() },
        ]);
      }
    }

    setShowOrgTypeModal(false);
    setEditingOrgType(null);
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
              onClick={() => {
                setEditingOrgType(null);
                setNewTypeName('');
                setNewTypeDesc('');
                setShowOrgTypeModal(true);
              }}
            >
              + Add Org Type
            </Button>
          </div>

          <div className={styles.orgTypeGrid}>
            {orgTypes.map((orgType) => (
              <article
                key={
                  orgType.id ||
                  orgType.typeName ||
                  orgType.type
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
                    {orgType.type ||
                      orgType.typeName ||
                      orgType.name}
                  </strong>

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button
                      type="button"
                      className={styles.orgTypeDelete}
                      style={{ color: '#0b777c', borderColor: 'var(--color-border)' }}
                      onClick={() =>
                        openEditOrgType(orgType)
                      }
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className={styles.orgTypeDelete}
                      onClick={() =>
                        handleDeleteOrgType(
                          orgType,
                        )
                      }
                    >
                      Delete
                    </button>
                  </div>
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
              onClick={() => {
                setShowOrgTypeModal(false);
                setEditingOrgType(null);
              }}
            >
              <form
                className={
                  styles.orgTypeModal
                }
                onClick={(event) =>
                  event.stopPropagation()
                }
                onSubmit={
                  handleSaveOrgType
                }
              >
                <h3
                  className={
                    styles.orgTypeModalTitle
                  }
                >
                  {editingOrgType
                    ? 'Edit Organization Type'
                    : 'Add Organization Type'}
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
                    onClick={() => {
                      setShowOrgTypeModal(false);
                      setEditingOrgType(null);
                    }}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    variant="primary"
                  >
                    {editingOrgType
                      ? 'Update Type'
                      : 'Create Type'}
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