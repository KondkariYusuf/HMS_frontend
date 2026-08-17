/**
 * @file TopNavBar.jsx
 * @description Header shell component with page title, search,
 * notifications, user profile avatar, branch switcher,
 * and light/dark theme toggle.
 */

import React, {
  useEffect,
  useState,
} from 'react';
import { useLocation } from 'react-router-dom';

import Avatar from '@components/Avatar/Avatar';
import { useAuth } from '@hooks/useAuth';

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
      d="M19.0708 19.071L17.6568 17.6568"
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
      d="M20.5 15.5C19.2 16.1 17.8 16.4 16.3 16.2C12.7 15.7 10.1 12.4 10.5 8.8C10.7 7.3 11.3 6 12.3 5C8.4 5.2 5.3 8.4 5.3 12.3C5.3 16.5 8.7 19.9 12.9 19.9C16.4 19.9 19.4 17.7 20.5 15.5Z"
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

  const location = useLocation();

  const [
    maintenanceTab,
    setMaintenanceTab,
  ] = useState('Property View');

  const [
    theme,
    setTheme,
  ] = useState('light');


  /* =========================
     LOAD CURRENT THEME
     ========================= */

  useEffect(() => {
    const currentTheme =
      document.documentElement.getAttribute(
        'data-theme',
      ) || 'light';

    setTheme(currentTheme);

    const handleStorageChange = (event) => {
      if (
        event.key === 'hms-theme' &&
        (event.newValue === 'light' ||
          event.newValue === 'dark')
      ) {
        setTheme(event.newValue);
      }
    };

    window.addEventListener(
      'storage',
      handleStorageChange,
    );

    return () => {
      window.removeEventListener(
        'storage',
        handleStorageChange,
      );
    };
  }, []);


  /* =========================
     THEME TOGGLE
     ========================= */

  const handleThemeToggle = () => {
    const nextTheme =
      theme === 'dark'
        ? 'light'
        : 'dark';

    document.documentElement.setAttribute(
      'data-theme',
      nextTheme,
    );

    window.localStorage.setItem(
      'hms-theme',
      nextTheme,
    );

    setTheme(nextTheme);
  };


  /* =========================
     MAINTENANCE
     ========================= */

  const isMaintenance =
    location.pathname.startsWith(
      '/maintenance',
    );


  /* =========================
     ACTIVE BRANCHES
     ========================= */

  const activeBranches = (
    branches || []
  ).filter(
    (branch) =>
      branch.status === 'Active',
  );

  const selectedBranchExists =
    activeBranches.some(
      (branch) =>
        branch.id === activeBranchId,
    );

  const currentBranchId =
    selectedBranchExists
      ? activeBranchId
      : activeBranches[0]?.id || '';


  const handleBranchChange = (
    event,
  ) => {
    const branchId =
      event.target.value;

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
        <div
          className={styles.leftSection}
        >
          <h2
            className={
              styles.brandPrimaryHeading
            }
          >
            Grand Horizon
          </h2>

          <div
            className={styles.flatTabs}
          >
            {[
              'Property View',
              'Front Desk',
              'Housekeeping',
            ].map((tab) => (
              <button
                type="button"
                key={tab}
                className={`
                  ${styles.flatTab}
                  ${maintenanceTab === tab
                    ? styles.flatTabActive
                    : ''
                  }
                `}
                onClick={() =>
                  setMaintenanceTab(tab)
                }
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div
          className={styles.rightSection}
        >
          <div
            className={
              styles.weatherBadge
            }
          >
            <WeatherIcon />
            72°F
          </div>

          <button
            type="button"
            className={
              styles.iconButton
            }
            aria-label={
              theme === 'dark'
                ? 'Switch to light mode'
                : 'Switch to dark mode'
            }
            title={
              theme === 'dark'
                ? 'Switch to light mode'
                : 'Switch to dark mode'
            }
            onClick={
              handleThemeToggle
            }
          >
            {theme === 'dark' ? (
              <SunIcon />
            ) : (
              <MoonIcon />
            )}
          </button>

          <button
            type="button"
            className={
              styles.iconButton
            }
            aria-label="Notifications"
          >
            <BellIcon />
          </button>

          <div
            className={
              styles.avatarEmpty
            }
          />
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
      <div
        className={styles.leftSection}
      >
        <div
          className={
            styles.titleWrapper
          }
        >
          <span
            className={
              styles.hospitalityText
            }
          >
            HospitalityOS
          </span>

          <span
            className={
              styles.titleDivider
            }
          >
            |
          </span>

          <h2
            className={styles.pageTitle}
          >
            {title}
          </h2>
        </div>

        {activeBranches.length > 0 && (
          <div
            className={
              styles.branchSelector
            }
            title="Switch active property"
          >
            <span
              className={
                styles.branchLabel
              }
            >
              PROPERTY
            </span>

            <select
              className={
                styles.branchSelect
              }
              value={currentBranchId}
              onChange={
                handleBranchChange
              }
              aria-label="Select active property"
            >
              {activeBranches.map(
                (branch) => (
                  <option
                    key={branch.id}
                    value={branch.id}
                  >
                    {branch.name}
                    {branch.location
                      ? ` — ${branch.location}`
                      : ''}
                  </option>
                ),
              )}
            </select>
          </div>
        )}

        {tabs.length > 0 && (
          <div
            className={
              styles.tabSwitcher
            }
          >
            {tabs.map((tab) => (
              <button
                type="button"
                key={tab}
                className={`
                  ${styles.tabItem}
                  ${tab === activeTab
                    ? styles.activeTab
                    : ''
                  }
                `}
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

      <div
        className={styles.rightSection}
      >
        <div
          className={
            styles.searchContainer
          }
        >
          <input
            type="text"
            placeholder="Search reservations, orders, guests..."
            className={
              styles.searchInput
            }
            aria-label="Search"
          />
        </div>

        <button
          type="button"
          className={
            styles.iconButton
          }
          aria-label={
            theme === 'dark'
              ? 'Switch to light mode'
              : 'Switch to dark mode'
          }
          title={
            theme === 'dark'
              ? 'Switch to light mode'
              : 'Switch to dark mode'
          }
          onClick={
            handleThemeToggle
          }
        >
          {theme === 'dark' ? (
            <SunIcon />
          ) : (
            <MoonIcon />
          )}
        </button>

        <button
          type="button"
          className={
            styles.iconButton
          }
          aria-label="Notifications"
        >
          <BellIcon />

          {hasNotification && (
            <span
              className={
                styles.notificationDot
              }
            />
          )}
        </button>

        <div
          className={
            styles.profileBlock
          }
        >
          <Avatar
            name={
              user?.name ||
              'Sarah Connor'
            }
            size="sm"
          />

          <div
            className={styles.userInfo}
          >
            <span
              className={
                styles.userName
              }
            >
              {user?.name ||
                'Sarah Connor'}
            </span>

            <span
              className={
                styles.userRole
              }
            >
              {user?.role ||
                'Front Desk Supervisor'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}