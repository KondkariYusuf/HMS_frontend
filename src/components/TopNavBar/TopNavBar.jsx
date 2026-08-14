/**
 * @file TopNavBar.jsx
 * @description Header shell component with page title, search, notifications,
 * user profile avatar, and active branch switcher.
 * @figmaFrame Figma frame: Header - TopNavBar
 */

import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Avatar from '@components/Avatar/Avatar';
import { useAuth } from '@hooks/useAuth';
import styles from './TopNavBar.module.css';

const SunIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="12"
      cy="12"
      r="4"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path d="M12 2V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M12 20V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M4 12H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M22 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path
      d="M19.0708 4.92896L17.6566 6.34317"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M6.34326 17.6569L4.92905 19.0711"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M19.0708 19.071L17.6566 17.6568"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M6.34326 6.34314L4.92905 4.92893"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const BellIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18 16V10C18 6.68629 15.3137 4 12 4C8.68629 4 6 6.68629 6 10V16H18Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M10 20C10.5523 20.8954 11.2386 21.5 12 21.5C12.7614 21.5 13.4477 20.8954 14 20"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M4 16H20"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const WeatherIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path d="M12 2V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M12 20V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M4 12H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M22 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path
      d="M19.0708 4.92896L17.6566 6.34317"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M6.34326 17.6569L4.92905 19.0711"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M19.0708 19.071L17.6566 17.6568"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M6.34326 6.34314L4.92905 4.92893"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export default function TopNavBar({
  title = 'Dashboard',
  tabs = [],
  activeTab = '',
  onTabChange,
  hasNotification = true,
}) {
  const {
    user,
    branches,
    activeBranchId,
    changeBranch,
  } = useAuth();

  const location = useLocation();

  const [maintenanceTab, setMaintenanceTab] =
    useState('Property View');

  const isBilling = location.pathname.startsWith(
    '/settings/billing-invoices'
  );

  const isMaintenance =
    location.pathname.startsWith('/maintenance');

  const activeBranches = (branches || []).filter(
    (branch) => branch.status === 'Active'
  );

  /*
   * Safety fallback:
   * If the persisted activeBranchId points to an inactive
   * or deleted branch, select the first active branch.
   */
  const selectedBranchExists = activeBranches.some(
    (branch) => branch.id === activeBranchId
  );

  const currentBranchId = selectedBranchExists
    ? activeBranchId
    : activeBranches[0]?.id || '';

  const handleBranchChange = (event) => {
    const branchId = event.target.value;

    if (branchId) {
      changeBranch(branchId);
    }
  };

  if (isBilling) {
    return (
      <header
        className={styles.header}
        data-testid="top-nav-bar"
      >
        <div className={styles.leftSection}>
          <div className={styles.billingTitle}>
            <span className={styles.brandPrimary}>
              HospitalityOS
            </span>

            <span className={styles.separator}>|</span>

            <span className={styles.pageTitleDark}>
              Billing & Invoices
            </span>
          </div>
        </div>

        <div className={styles.rightSection}>
          <button
            type="button"
            className={styles.iconButton}
            aria-label="Toggle Theme"
          >
            <SunIcon />
          </button>

          <button
            type="button"
            className={styles.iconButton}
            aria-label="Notifications"
          >
            <BellIcon />
            <span className={styles.notificationDot} />
          </button>

          <div className={styles.avatarEmpty} />

          <button
            type="button"
            className={styles.profileButton}
            aria-label="Profile"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>
        </div>
      </header>
    );
  }

  if (isMaintenance) {
    return (
      <header
        className={styles.header}
        data-testid="top-nav-bar"
      >
        <div className={styles.leftSection}>
          <h2 className={styles.brandPrimaryHeading}>
            Grand Horizon
          </h2>

          <div className={styles.flatTabs}>
            {[
              'Property View',
              'Front Desk',
              'Housekeeping',
            ].map((tab) => (
              <button
                type="button"
                key={tab}
                className={`${styles.flatTab} ${maintenanceTab === tab
                    ? styles.flatTabActive
                    : ''
                  }`}
                onClick={() => setMaintenanceTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.rightSection}>
          <div className={styles.weatherBadge}>
            <WeatherIcon />
            72°F
          </div>

          <button
            type="button"
            className={styles.iconButton}
            aria-label="Notifications"
          >
            <BellIcon />
          </button>

          <div className={styles.avatarEmpty} />
        </div>
      </header>
    );
  }

  return (
    <header
      className={styles.header}
      data-testid="top-nav-bar"
    >
      <div className={styles.leftSection}>
        <h2 className={styles.pageTitle}>
          {title}
        </h2>

        {/* Active Branch / Property Selector */}
        {activeBranches.length > 0 && (
          <div
            className={styles.branchSelector}
            title="Switch active property"
          >
            <span className={styles.branchLabel}>
              PROPERTY
            </span>

            <select
              className={styles.branchSelect}
              value={currentBranchId}
              onChange={handleBranchChange}
              aria-label="Select active property"
            >
              {activeBranches.map((branch) => (
                <option
                  key={branch.id}
                  value={branch.id}
                >
                  {branch.name}
                  {branch.location
                    ? ` — ${branch.location}`
                    : ''}
                </option>
              ))}
            </select>
          </div>
        )}

        {tabs.length > 0 && (
          <div className={styles.tabSwitcher}>
            {tabs.map((tab) => (
              <button
                type="button"
                key={tab}
                className={`${styles.tabItem} ${tab === activeTab
                    ? styles.activeTab
                    : ''
                  }`}
                onClick={() =>
                  onTabChange &&
                  onTabChange(tab)
                }
              >
                {tab}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className={styles.rightSection}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search reservations, orders, guests..."
            className={styles.searchInput}
            aria-label="Search"
          />
        </div>

        <button
          type="button"
          className={styles.iconButton}
          aria-label="Notifications"
        >
          <span className={styles.iconPlaceholder}>
            🔔
          </span>

          {hasNotification && (
            <span className={styles.notificationDot} />
          )}
        </button>

        <div className={styles.profileBlock}>
          <Avatar
            name={user?.name || 'Sarah Connor'}
            size="sm"
          />

          <div className={styles.userInfo}>
            <span className={styles.userName}>
              {user?.name || 'Sarah Connor'}
            </span>

            <span className={styles.userRole}>
              {user?.role ||
                'Front Desk Supervisor'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}