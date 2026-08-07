/**
 * @file Admin/Settings/Index.jsx
 * @description General system settings, currency preferences, and tenant configuration.
 * @figmaFrame Figma frame: Admin - General Configuration (22-app-settings.md)
 */
import React from 'react';
import Button from '@components/Button/Button';
import styles from './Index.module.css';

export default function AdminSettingsPage() {
  return (
    <div className={styles.page} data-testid="admin-settings-page">
      <header className={styles.header}>
        <h1 className={styles.title}>System & Property Settings</h1>
        <p className={styles.subtitle}>
          [ Screen Stub — API Group: App Settings (22-app-settings.md) ]
        </p>
      </header>

      <div className={styles.settingsSection}>
        <h3 className={styles.sectionTitle}>General Hotel Profile</h3>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Property Name</label>
          <input
            type="text"
            defaultValue="Grand Horizon Resort & Suites"
            className={styles.input}
          />
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Base Currency</label>
          <select className={styles.select} defaultValue="USD">
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
          </select>
        </div>
        <div className={styles.actions}>
          <Button variant="primary">Save Settings</Button>
        </div>
      </div>
    </div>
  );
}
