/**
 * @file TopNavBar.jsx
 * @description Header shell component with page title, search, notifications, user profile avatar, and branch switcher.
 * @figmaFrame Figma frame: Header - TopNavBar
 */
import React from 'react';
import Avatar from '@components/Avatar/Avatar';
import { useAuth } from '@hooks/useAuth';
import styles from './TopNavBar.module.css';

export default function TopNavBar({
  title = 'Dashboard',
  tabs = [],
  activeTab = '',
  onTabChange,
  hasNotification = true,
}) {
  const { user, branches, activeBranchId, changeBranch } = useAuth();

  return (
    <header className={styles.header} data-testid="top-nav-bar">
      <div className={styles.leftSection}>
        <h2 className={styles.pageTitle}>{title}</h2>

        {/* Branch Selector (Tenancy Header x-branch-id) */}
        {branches && branches.length > 0 && (
          <div className={styles.branchSelector}>
            <span className={styles.branchLabel}>Branch:</span>
            <select
              className={styles.branchSelect}
              value={activeBranchId}
              onChange={(e) => changeBranch(e.target.value)}
            >
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {tabs.length > 0 && (
          <div className={styles.tabSwitcher}>
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`${styles.tabItem} ${
                  tab === activeTab ? styles.activeTab : ''
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
          />
        </div>

        <button className={styles.iconButton} aria-label="Notifications">
          <span className={styles.iconPlaceholder}>🔔</span>
          {hasNotification && <span className={styles.notificationDot} />}
        </button>

        <div className={styles.profileBlock}>
          <Avatar name={user?.name || 'Sarah Connor'} size="sm" />
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
