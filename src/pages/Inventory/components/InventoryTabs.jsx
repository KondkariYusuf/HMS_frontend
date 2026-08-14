import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styles from './InventoryTabs.module.css';

const TABS = [
  { label: 'Products', path: '/inventory/products' },
  { label: 'Stock', path: '/inventory/stock' },
  { label: 'Suppliers', path: '/inventory/suppliers' },
  // { label: 'Purchase Orders', path: '/inventory/purchase-orders' },
];

export default function InventoryTabs() {
  const location = useLocation();

  return (
    <div className={styles.tabsContainer}>
      <nav className={styles.tabsList}>
        {TABS.map((tab) => {
          const isActive = location.pathname.startsWith(tab.path);
          return (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={`${styles.tab} ${isActive ? styles.activeTab : ''}`}
            >
              {tab.label}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
