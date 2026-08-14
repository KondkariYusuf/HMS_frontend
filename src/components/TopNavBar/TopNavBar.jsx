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
        <div className={styles.titleWrapper}>
          <span className={styles.hospitalityText}>HospitalityOS</span>
          <span className={styles.titleDivider}>|</span>
          <h2 className={styles.pageTitle}>{title}</h2>
        </div>

        {/* Branch Selector (Tenancy Header x-branch-id) */}
        {branches && branches.length > 1 && (
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
        <button className={styles.iconButton} aria-label="Theme">
          <span className={styles.iconPlaceholder}>☼</span>
        </button>

        <button className={styles.iconButton} aria-label="Notifications">
          <span className={styles.iconPlaceholder}>🔔</span>
          {hasNotification && <span className={styles.notificationDot} />}
        </button>

        <div className={styles.profileBlock}>
          <Avatar name={user?.name || 'Sarah Connor'} size="sm" />
        </div>
      </div>
    </header>
  );
}
