/**
 * @file SideNavBar.jsx
 * @description Primary navigation sidebar for SyncStays HMS categorized into grouped domain sections.
 * @figmaFrame Figma frame: Navigation - SideNavBar
 */

import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styles from './SideNavBar.module.css';

const Icon = ({ name }) => {
  switch (name) {
    case 'dashboard':
      return (
        <svg
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="2"
            y="2"
            width="5"
            height="5"
            rx="1"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <rect
            x="9"
            y="2"
            width="5"
            height="5"
            rx="1"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <rect
            x="2"
            y="9"
            width="5"
            height="5"
            rx="1"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <rect
            x="9"
            y="9"
            width="5"
            height="5"
            rx="1"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'calendar':
      return (
        <svg
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="2"
            y="3"
            width="12"
            height="11"
            rx="1.5"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M5 1.5V4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M11 1.5V4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M2 7.5H14"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      );

    case 'bed':
      return (
        <svg
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 13V5C2 3.89543 2.89543 3 4 3H12C13.1046 3 14 3.89543 14 5V13"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 10H14"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5 7H7"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'users':
      return (
        <svg
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="5.5"
            cy="5.5"
            r="2.5"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M1 14C1 11.5147 3.01472 9.5 5.5 9.5C7.98528 9.5 10 11.5147 10 14"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle
            cx="11.5"
            cy="6.5"
            r="2"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M14.5 14C14.5 12.067 12.933 10.5 11 10.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'bar-chart':
      return (
        <svg
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="2"
            y="8"
            width="3"
            height="6"
            rx="0.5"
            fill="currentColor"
          />
          <rect
            x="6.5"
            y="4"
            width="3"
            height="10"
            rx="0.5"
            fill="currentColor"
          />
          <rect
            x="11"
            y="2"
            width="3"
            height="12"
            rx="0.5"
            fill="currentColor"
          />
        </svg>
      );

    case 'gear':
      return (
        <svg
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="8"
            cy="8"
            r="2.5"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M8 2V3.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M8 12.5V14"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M3.75732 3.75732L4.81802 4.81802"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M11.1821 11.1816L12.2428 12.2423"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M2 8H3.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M12.5 8H14"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M3.75732 12.2427L4.81802 11.182"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M11.1821 4.81836L12.2428 3.75766"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'wrench':
      return (
        <svg
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9.5 4.5C9.5 5.88071 8.38071 7 7 7C6.67104 7 6.35688 6.93665 6.07185 6.82276L2.35355 10.5411C2.15829 10.7363 2.15829 11.0529 2.35355 11.2482L4.25178 13.1464C4.44704 13.3417 4.76362 13.3417 4.95888 13.1464L8.67724 9.42815C8.79113 9.71318 8.85448 10.0273 8.85448 10.3556C8.85448 11.7363 7.73519 12.8556 6.35448 12.8556"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13.5 2.5L10 6L9.5 4.5L8 4L11.5 0.5L13.5 2.5Z"
            fill="currentColor"
          />
        </svg>
      );

    case 'chart-line':
      return (
        <svg
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 14V2"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 14H14"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4 10L7 6L9 8L13 3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'help':
      return (
        <svg
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="8"
            cy="8"
            r="6.5"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M8 11.5V11.4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M8 9.5C8 9.5 9.5 9 9.5 7.5C9.5 6 8.5 5 7.5 5C6.5 5 6 6.5 6 6.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'logout':
      return (
        <svg
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 14H3.5C2.67157 14 2 13.3284 2 12.5V3.5C2 2.67157 2.67157 2 3.5 2H6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M10 11L13 8L10 5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13 8H6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );

    default:
      return null;
  }
};

export default function SideNavBar() {
  const location = useLocation();

  const isBilling = location.pathname.startsWith(
    '/settings/billing-invoices'
  );

  const isMaintenance = location.pathname.startsWith('/maintenance');

  const billingItems = [
    { path: '/', label: 'Dashboard', icon: 'dashboard' },
    {
      path: '/hotel/reservations',
      label: 'Reservations',
      icon: 'calendar',
    },
    {
      path: '/hotel/rooms',
      label: 'Rooms',
      icon: 'bed',
    },
    {
      path: '/staff',
      label: 'Staff',
      icon: 'users',
    },
    {
      path: '/billing/reports',
      label: 'Reports',
      icon: 'bar-chart',
    },
    {
      path: '/settings/billing-invoices',
      label: 'Settings',
      icon: 'gear',
    },
  ];

  const maintenanceItems = [
    { path: '/', label: 'Dashboard', icon: 'dashboard' },
    {
      path: '/maintenance',
      label: 'Maintenance',
      icon: 'wrench',
    },
    {
      path: '/hotel/reservations',
      label: 'Reservations',
      icon: 'calendar',
    },
    {
      path: '/hotel/rooms',
      label: 'Rooms',
      icon: 'bed',
    },
    {
      path: '/analytics',
      label: 'Analytics',
      icon: 'chart-line',
    },
    {
      path: '/staff',
      label: 'Staff',
      icon: 'users',
    },
  ];

  const renderBrand = () => {
    if (isBilling) {
      return (
        <div className={styles.brandBlockBilling}>
          <div className={styles.ghLogo}>GH</div>

          <div className={styles.brandTextBlock}>
            <h1 className={styles.brandTitle}>Grand Horizon</h1>
            <span className={styles.brandSubtitle}>
              LUXURY RESORT
            </span>
          </div>
        </div>
      );
    }

    if (isMaintenance) {
      return (
        <div className={styles.brandBlock}>
          <h1 className={styles.brandTitle}>Grand Horizon</h1>
          <span className={styles.brandSubtitle}>
            HOTEL OPERATIONS
          </span>
        </div>
      );
    }

    return (
      <div className={styles.brandBlock}>
        <h1 className={styles.brandTitle}>Grand Horizon</h1>
        <span className={styles.brandSubtitle}>
          SyncStays Platform
        </span>
      </div>
    );
  };

  const renderNavItems = () => {
    if (isBilling || isMaintenance) {
      const items = isBilling
        ? billingItems
        : maintenanceItems;

      return (
        <ul className={`${styles.navList} ${styles.flatList}`}>
          {items.map((item) => (
            <li
              key={item.path}
              className={styles.navItem}
            >
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  isActive
                    ? `${styles.navLink} ${styles.active}`
                    : styles.navLink
                }
                end={item.path === '/'}
              >
                <span className={styles.navIcon}>
                  <Icon name={item.icon} />
                </span>

                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      );
    }

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
          {
            path: '/hotel/reservations',
            label: 'Reservations',
          },
          {
            path: '/hotel/check-in',
            label: 'Express Check-In',
          },
          {
            path: '/hotel/rooms',
            label: 'Rooms & Floors',
          },
          {
            path: '/hotel/guests',
            label: 'Guest Directory',
          },
        ],
      },

      {
        title: 'RESTAURANT',
        items: [
          {
            path: '/restaurant/pos',
            label: 'POS Terminal',
          },
          {
            path: '/restaurant/menu',
            label: 'Menu Catalog',
          },
          {
            path: '/restaurant/kds',
            label: 'Kitchen (KDS)',
          },
          {
            path: '/restaurant/tables',
            label: 'Tables & Areas',
          },
        ],
      },

      {
        title: 'INVENTORY & SUPPLY',
        items: [
          {
            path: '/inventory/products',
            label: 'Products & Stock',
          },
          {
            path: '/inventory/suppliers',
            label: 'Suppliers',
          },
          {
            path: '/inventory/purchase-orders',
            label: 'Purchase Orders',
          },
        ],
      },

      {
        title: 'CUSTOMERS & BILLING',
        items: [
          {
            path: '/customers/directory',
            label: 'Customer CRM',
          },
          {
            path: '/billing/invoices',
            label: 'Invoices & Billing',
          },
          {
            path: '/billing/payments',
            label: 'Payment Processing',
          },
          {
            path: '/billing/reports',
            label: 'Revenue Reports',
          },
          {
            path: '/settings/billing-invoices',
            label: 'Billing Settings',
          },
        ],
      },

      {
        title: 'FINANCE & MAINTENANCE',
        items: [
          {
            path: '/finance/monthly-salary',
            label: 'Yearly Salary Summary',
          },
          {
            path: '/finance/cash-register',
            label: 'Cash Register',
          },
        ],
      },

      {
        title: 'STAFF',
        items: [
          {
            path: '/staff/salary',
            label: 'Staff & Salary',
          },
          {
            path: '/staff/Attendence',
            label: 'Attendence',
          },
          {
            path: '/staff/advances',
            label: 'Advances',
          },
          {
            path: '/staff/housekeeping',
            label: 'Housekeeping',
          },
        ],
      },

      {
        title: 'ADMINISTRATION',
        items: [
          {
            path: '/admin/users',
            label: 'User Directory',
          },
          {
            path: '/admin/rbac',
            label: 'RBAC Roles',
          },
          {
            path: '/admin/branches',
            label: 'Branches',
          },
          {
            path: '/admin/settings',
            label: 'Settings',
          },
        ],
      },

      {
        title: 'MAINTENANCE',
        items: [
          {
            path: '/maintenance',
            label: 'Maintenance Dashboard',
          },
        ],
      },
    ];

    return navGroups.map((group) => (
      <div
        key={group.title}
        className={styles.navGroup}
      >
        <span className={styles.groupTitle}>
          {group.title}
        </span>

        <ul className={styles.navList}>
          {group.items.map((item) => (
            <li
              key={item.path}
              className={styles.navItem}
            >
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
    ));
  };

  const renderFooter = () => {
    if (isBilling) {
      return (
        <div className={styles.footerBlock}>
          <a
            href="https://support.example.com"
            target="_blank"
            rel="noreferrer"
            className={styles.footerLink}
          >
            <span className={styles.navIcon}>
              <Icon name="help" />
            </span>
            Support
          </a>

          <NavLink
            to="/login"
            className={styles.footerLink}
          >
            <span className={styles.navIcon}>
              <Icon name="logout" />
            </span>
            Log Out
          </NavLink>
        </div>
      );
    }

    if (isMaintenance) {
      return (
        <div className={styles.footerBlock}>
          <a
            href="https://support.example.com"
            target="_blank"
            rel="noreferrer"
            className={styles.footerLink}
          >
            <span className={styles.navIcon}>
              <Icon name="help" />
            </span>
            Help Center
          </a>

          <NavLink
            to="/login"
            className={styles.footerLink}
          >
            <span className={styles.navIcon}>
              <Icon name="logout" />
            </span>
            Logout
          </NavLink>
        </div>
      );
    }

    return (
      <div className={styles.footerBlock}>
        <NavLink
          to="/notifications"
          className={styles.footerLink}
        >
          Notifications
        </NavLink>

        <NavLink
          to="/login"
          className={styles.footerLink}
        >
          Logout
        </NavLink>
      </div>
    );
  };

  return (
    <aside
      className={styles.sidebar}
      data-testid="sidebar-nav"
    >
      {renderBrand()}

      <nav className={styles.navContainer}>
        {renderNavItems()}
      </nav>

      {renderFooter()}
    </aside>
  );
}