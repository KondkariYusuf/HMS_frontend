/**
 * @file SideNavBar.jsx
 * @description Primary navigation sidebar for SyncStays HMS categorized into grouped domain sections.
 * @figmaFrame Figma frame: Navigation - SideNavBar
 */
import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './SideNavBar.module.css';

export default function SideNavBar() {
  const navGroups = [
    {
      title: 'OVERVIEW',
      items: [
        { path: '/', label: 'Dashboard' },
        { path: '/analytics', label: 'Analytics' },
      ],
    },
    {
      title: 'HOTEL',
      items: [
        { path: '/hotel/reservations', label: 'Reservations' },
        { path: '/hotel/check-in', label: 'Express Check-In' },
        { path: '/hotel/rooms', label: 'Rooms & Floors' },
        { path: '/hotel/guests', label: 'Guest Directory' },
      ],
    },
    {
      title: 'RESTAURANT',
      items: [
        { path: '/restaurant/pos', label: 'POS Terminal' },
        { path: '/restaurant/menu', label: 'Menu Catalog' },
        { path: '/restaurant/kds', label: 'Kitchen (KDS)' },
        { path: '/restaurant/tables', label: 'Tables & Areas' },
      ],
    },
    {
      title: 'INVENTORY & SUPPLY',
      items: [
        { path: '/inventory/products', label: 'Products & Stock' },
        { path: '/inventory/suppliers', label: 'Suppliers' },
        { path: '/inventory/purchase-orders', label: 'Purchase Orders' },
      ],
    },
    {
      title: 'CUSTOMERS & BILLING',
      items: [
        { path: '/customers/directory', label: 'Customer CRM' },
        { path: '/billing/invoices', label: 'Invoices & Billing' },
        { path: '/billing/reports', label: 'Revenue Reports' },
      ],
    },
    {
      title: 'STAFF',
      items: [
        { path: '/staff', label: 'Staff Dashboard' },
        { path: '/staff/Attendence', label: 'Attendance' },
        { path: '/staff/advances', label: 'Advances' },
      ],
    },
    {
      title: 'ADMINISTRATION',
      items: [
        { path: '/admin/users', label: 'User Directory' },
        { path: '/admin/rbac', label: 'RBAC Roles' },
        { path: '/admin/branches', label: 'Branches' },
        { path: '/admin/settings', label: 'Settings' },
      ],
    },
  ];

  return (
    <aside className={styles.sidebar} data-testid="sidebar-nav">
      <div className={styles.brandBlock}>
        <h1 className={styles.brandTitle}>Grand Horizon</h1>
        <span className={styles.brandSubtitle}>SyncStays Platform</span>
      </div>
      <nav className={styles.navContainer}>
        {navGroups.map((group) => (
          <div key={group.title} className={styles.navGroup}>
            <span className={styles.groupTitle}>{group.title}</span>
            <ul className={styles.navList}>
              {group.items.map((item) => (
                <li key={item.path} className={styles.navItem}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      isActive
                        ? `${styles.navLink} ${styles.active}`
                        : styles.navLink
                    }
                    end={item.path === '/'}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      <div className={styles.footerBlock}>
        <NavLink to="/notifications" className={styles.footerLink}>
          Notifications
        </NavLink>
        <NavLink to="/login" className={styles.footerLink}>
          Logout
        </NavLink>
      </div>
    </aside>
  );
}
