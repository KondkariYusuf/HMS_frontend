/**
 * @file MainLayout.jsx
 * @description Main authenticated shell layout housing the SideNavBar, TopNavBar header, and route outlet content container.
 * @figmaFrame Figma frame: MainLayout (SideNavBar + TopNavBar shell)
 */
import React from 'react';
import { Outlet } from 'react-router-dom';
import SideNavBar from '@components/SideNavBar/SideNavBar';
import TopNavBar from '@components/TopNavBar/TopNavBar';
import styles from './MainLayout.module.css';

export default function MainLayout() {
  return (
    <div className={styles.layoutShell} data-testid="main-layout">
      <SideNavBar />
      <TopNavBar title="Grand Horizon HMS" />
      <main className={styles.mainContent}>
        <div className={styles.pageContainer}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
