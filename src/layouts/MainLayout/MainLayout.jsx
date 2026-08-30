/**
 * @file MainLayout.jsx
 * @description Main authenticated shell layout housing the SideNavBar, TopNavBar header, and route outlet content container.
 * Enforces authentication check so unauthenticated visits redirect to /login.
 */
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import SideNavBar from '@components/SideNavBar/SideNavBar';
import TopNavBar from '@components/TopNavBar/TopNavBar';
import { NotificationProvider } from '@hooks/useNotifications';
import styles from './MainLayout.module.css';

export default function MainLayout() {
  const token = localStorage.getItem('syncstays_token');

  // If no token, or stale demo token, redirect to login
  if (!token || token === 'demo_token' || token === 'null' || token === '') {
    // Clean up all stale auth data
    localStorage.removeItem('syncstays_token');
    localStorage.removeItem('syncstays_user');
    localStorage.removeItem('syncstays_branches');
    localStorage.removeItem('syncstays_branch_id');
    localStorage.removeItem('authToken');
    return <Navigate to="/login" replace />;
  }

  return (
    <NotificationProvider>
      <div className={styles.layoutShell} data-testid="main-layout">
        <SideNavBar />
        <TopNavBar title="Grand Hotel HMS" />
        <main className={styles.mainContent}>
          <div className={styles.pageContainer}>
            <Outlet />
          </div>
        </main>
      </div>
    </NotificationProvider>
  );
}
