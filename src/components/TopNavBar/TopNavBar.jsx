/**
 * @file TopNavBar.jsx
 * @description Header shell component with page title, search, notifications,
 * user profile avatar, active branch switcher, and light/dark theme toggle.
 * @figmaFrame Figma frame: Header - TopNavBar
 */

import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Avatar from '@components/Avatar/Avatar';
import { useAuth } from '@hooks/useAuth';
import { useTheme } from '@app/ThemeContext';
import styles from './TopNavBar.module.css';

/* =========================
   SUN ICON
   ========================= */

const SunIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <circle
      cx="12"
      cy="12"
      r="4"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M12 2V4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M12 20V22"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M4 12H2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M22 12H20"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
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

/* =========================
   MOON ICON
   ========================= */

const MoonIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* =========================
   BELL ICON
   ========================= */

const BellIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
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

/* =========================
   WEATHER ICON
   ========================= */

const WeatherIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M12 2V4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M12 20V22"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M4 12H2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M22 12H20"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
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

/* =========================
   TOP NAVIGATION
   ========================= */

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

  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const [maintenanceTab, setMaintenanceTab] = useState('Property View');
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!notificationRef.current?.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const notificationControl = (
    <div className={styles.notificationControl} ref={notificationRef}>
      <button
        type="button"
        className={styles.iconButton}
        aria-label="Notifications"
        aria-expanded={isNotificationOpen}
        onClick={() => setIsNotificationOpen((isOpen) => !isOpen)}
      >
        <BellIcon />
        {hasNotification && <span className={styles.notificationDot} />}
      </button>

      {isNotificationOpen && (
        <div className={styles.notificationMenu} role="dialog" aria-label="Notification center">
          <div className={styles.notificationMenuHeader}>
            <h3>Notification Center</h3>
            {hasNotification && <span className={styles.notificationCount}>New</span>}
          </div>
          <p className={styles.notificationEmpty}>No new notifications.</p>
          <button
            type="button"
            className={styles.notificationLink}
            onClick={() => {
              setIsNotificationOpen(false);
              navigate('/notifications');
            }}
          >
            Open notification center
          </button>
        </div>
      )}
    </div>
  );

  const isMaintenance = location.pathname.startsWith('/maintenance');

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

  /* =========================
     MAINTENANCE HEADER
     ========================= */

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
                className={`${styles.flatTab} ${maintenanceTab === tab ? styles.flatTabActive : ''
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
            aria-label="Toggle theme"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            onClick={toggleTheme}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>

          {notificationControl}

          <div className={styles.avatarEmpty} />
        </div>
      </header>
    );
  }

  /* =========================
     NORMAL HEADER
     ========================= */

  return (
    <header
      className={styles.header}
      data-testid="top-nav-bar"
    >
      <div className={styles.leftSection}>
        <div className={styles.titleWrapper}>
          <h2 className={styles.pageTitle}>
            {title}
          </h2>
        </div>

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
                className={`${styles.tabItem} ${tab === activeTab ? styles.activeTab : ''
                  }`}
                onClick={() => onTabChange && onTabChange(tab)}
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
          aria-label="Toggle theme"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          onClick={toggleTheme}
        >
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>

        {notificationControl}

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
              {user?.role || 'Front Desk Supervisor'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}