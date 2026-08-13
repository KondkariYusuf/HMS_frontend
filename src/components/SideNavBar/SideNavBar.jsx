/**
 * @file SideNavBar.jsx
 * @description Primary navigation sidebar for SyncStays HMS categorized into grouped accordion submenus.
 * @figmaFrame Figma frame: Navigation - SideNavBar
 */
import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styles from './SideNavBar.module.css';

export default function SideNavBar() {
  const location = useLocation();

  const navGroups = [
    {
      title: 'Overview',
      items: [
        { path: '/', label: 'Dashboard', icon: '📊' },
        { path: '/analytics', label: 'Analytics', icon: '📈' },
      ],
    },
    {
      title: 'Hotel Operations',
      items: [
        { path: '/hotel/reservations', label: 'Reservations', icon: '📅' },
        { path: '/hotel/check-in', label: 'Express Check-In', icon: '🔑' },
        { path: '/hotel/rooms', label: 'Rooms & Floors', icon: '🛏️' },
        { path: '/hotel/guests', label: 'Guest Directory', icon: '👥' },
      ],
    },
    {
      title: 'Restaurant & F&B',
      items: [
        { path: '/restaurant/pos', label: 'POS Terminal', icon: '🍕' },
        { path: '/restaurant/kds', label: 'Kitchen (KDS)', icon: '👨‍🍳' },
        { path: '/restaurant/menu', label: 'Menu Catalog', icon: '📖' },
        { path: '/restaurant/tables', label: 'Tables & Areas', icon: '🪑' },
      ],
    },
    {
      title: 'Inventory & Supply',
      items: [
        { path: '/inventory/products', label: 'Products & Stock', icon: '📦' },
        { path: '/inventory/suppliers', label: 'Suppliers', icon: '🚚' },
        { path: '/inventory/purchase-orders', label: 'Purchase Orders', icon: '📝' },
      ],
    },
    {
      title: 'Customers & Billing',
      items: [
        { path: '/customers/directory', label: 'Customer CRM', icon: '💼' },
        { path: '/billing/invoices', label: 'Invoices & Billing', icon: '🧾' },
        { path: '/billing/reports', label: 'Revenue Reports', icon: '💰' },
        { path: '/billing/settings', label: 'Billing Settings', icon: '⚙️' },
      ],
    },
    {
      title: 'Administration',
      items: [
        { path: '/admin/users', label: 'User Directory', icon: '👤' },
        { path: '/admin/rbac', label: 'RBAC Roles', icon: '🛡️' },
        { path: '/admin/branches', label: 'Branches', icon: '🏢' },
        { path: '/admin/settings', label: 'System Settings', icon: '🛠️' },
      ],
    },
  ];

  // Accordion open/close state
  const [openGroups, setOpenGroups] = useState({});

  // Auto-expand group containing the active pathname
  useEffect(() => {
    const activeGroup = navGroups.find((g) =>
      g.items.some((item) =>
        item.path === '/'
          ? location.pathname === '/'
          : location.pathname.startsWith(item.path)
      )
    );

    if (activeGroup) {
      setOpenGroups((prev) => ({
        ...prev,
        [activeGroup.title]: true,
      }));
    }
  }, [location.pathname]);

  const toggleGroup = (title) => {
    setOpenGroups((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <aside className={styles.sidebar} data-testid="sidebar-nav">
      <div className={styles.brandBlock}>
        <h1 className={styles.brandTitle}>Grand Horizon</h1>
        <span className={styles.brandSubtitle}>SyncStays Platform</span>
      </div>

      <nav className={styles.navContainer}>
        {navGroups.map((group) => {
          const isGroupActive = group.items.some((item) =>
            item.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.path)
          );
          const isOpen = openGroups[group.title] !== undefined
            ? openGroups[group.title]
            : isGroupActive;

          return (
            <div key={group.title} className={styles.navGroup}>
              <button
                type="button"
                className={styles.groupHeaderBtn}
                onClick={() => toggleGroup(group.title)}
                aria-expanded={isOpen}
              >
                <span
                  className={`${styles.groupTitle} ${
                    isGroupActive ? styles.groupTitleActive : ''
                  }`}
                >
                  {group.title}
                </span>
                <span
                  className={`${styles.chevronIcon} ${
                    isOpen ? styles.chevronExpanded : ''
                  }`}
                >
                  ▼
                </span>
              </button>

              {isOpen && (
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
                        <span className={styles.navIcon}>{item.icon}</span>
                        <span>{item.label}</span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </nav>

      <div className={styles.footerBlock}>
        <NavLink to="/notifications" className={styles.footerLink}>
          🔔 Notifications
        </NavLink>
        <NavLink to="/login" className={styles.footerLink}>
          🚪 Logout
        </NavLink>
      </div>
    </aside>
  );
}