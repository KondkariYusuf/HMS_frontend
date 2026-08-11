/**
 * @file Admin/Settings/Index.jsx
 * @description Hotel configuration dashboard for general property settings
 * and architectural room mapping.
 * @figmaFrame Refined Hotel Configuration Dashboard
 */

import React, { useMemo, useState } from 'react';
import Button from '@components/Button/Button';
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
      <strong className={styles.roomNumber}>Room {room.room}</strong>

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
  const [hotelName, setHotelName] = useState('Grand Horizon Resort');
  const [taxRate, setTaxRate] = useState('12.5');
  const [currency, setCurrency] = useState('USD');
  const [rooms, setRooms] = useState(INITIAL_ROOMS);
  const [saved, setSaved] = useState(false);

  const roomTypeCounts = useMemo(() => {
    return rooms.reduce((accumulator, room) => {
      accumulator[room.type] = (accumulator[room.type] || 0) + 1;
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

    console.log('Hotel configuration saved:', configuration);
    setSaved(true);
  };

  const handleExport = () => {
    const configuration = {
      hotelName,
      taxRate,
      currency,
      rooms,
    };

    const blob = new Blob([JSON.stringify(configuration, null, 2)], {
      type: 'application/json',
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');

    anchor.href = url;
    anchor.download = 'hotel-configuration.json';
    anchor.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.page} data-testid="admin-settings-page">
      <div className={styles.breadcrumb}>
        <span>Settings</span>
        <span>/</span>
        <strong>Configuration</strong>
      </div>

      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Hotel Configuration</h1>
          <p className={styles.subtitle}>
            Adjust global settings and room architectural mappings.
          </p>
        </div>

        <div className={styles.headerActions}>
          <Button variant="secondary" onClick={handleExport}>
            Export
          </Button>

          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </header>

      <section className={styles.configurationCard}>
        <div className={styles.section}>
          <div className={styles.sectionHeading}>
            <span className={styles.sectionAccent} />
            <h2>General Information</h2>
          </div>

          <div className={styles.generalGrid}>
            <div className={styles.fieldGroup}>
              <label htmlFor="hotel-name" className={styles.label}>
                Hotel Name
              </label>

              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>▧</span>

                <input
                  id="hotel-name"
                  type="text"
                  className={styles.input}
                  value={hotelName}
                  onChange={(event) => {
                    setHotelName(event.target.value);
                    setSaved(false);
                  }}
                />
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="tax-rate" className={styles.label}>
                Default Tax Rate (%)
              </label>

              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>%</span>

                <input
                  id="tax-rate"
                  type="number"
                  min="0"
                  step="0.1"
                  className={styles.input}
                  value={taxRate}
                  onChange={(event) => {
                    setTaxRate(event.target.value);
                    setSaved(false);
                  }}
                />
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="currency-locale" className={styles.label}>
                Currency Locale
              </label>

              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>▣</span>

                <select
                  id="currency-locale"
                  className={styles.select}
                  value={currency}
                  onChange={(event) => {
                    setCurrency(event.target.value);
                    setSaved(false);
                  }}
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="INR">INR (₹)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.section}>
          <div className={styles.mappingHeader}>
            <div className={styles.sectionHeading}>
              <span className={styles.sectionAccent} />
              <h2>Architectural Room Mapping</h2>
            </div>

            <div className={styles.legend}>
              <span className={styles.legendItem}>
                <span className={`${styles.legendDot} ${styles.standardDot}`} />
                2B Standard
              </span>

              <span className={styles.legendItem}>
                <span className={`${styles.legendDot} ${styles.deluxeDot}`} />
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

          <div className={styles.overlayPreview}>
            <div className={styles.overlayHeader}>
              <span>Architecture Overlay Preview</span>
              <button
                type="button"
                className={styles.expandButton}
                aria-label="Expand architecture preview"
              >
                ⤢
              </button>
            </div>

            <div className={styles.overlayCanvas}>
              <div className={styles.previewContent}>
                <span className={styles.previewLabel}>Current Mapping</span>

                <strong>{rooms.length} Rooms Configured</strong>

                <div className={styles.previewStats}>
                  {Object.entries(roomTypeCounts).map(([type, count]) => (
                    <span key={type}>
                      {type}: {count}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.saveArea}>
            <p className={styles.editNote}>
              Last edited by AT. Changes to tax rates will apply to all future
              reservations immediately.
            </p>

            <Button variant="primary" onClick={handleSave}>
              {saved ? 'Configuration Saved' : 'Save Configuration'}
            </Button>
          </div>
        </div>
      </section>

      <aside className={styles.adminNote}>
        <div className={styles.noteIcon}>i</div>

        <div>
          <span className={styles.noteTitle}>Administrator Note</span>

          <p>
            The room mapping grid is synced with the hotel's physical
            blueprint. Changing a room type here will affect pricing tiers and
            housekeeping assignment protocols across the platform. Use caution
            when reclassifying occupied rooms.
          </p>
        </div>
      </aside>
    </div>
  );
}