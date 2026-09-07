/**
 * @file SideNavBar.jsx
 * @description Global application navigation for SyncStays HMS.
 */

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  NavLink,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { useAuth } from '@app/AuthContext';
import { hasPermission } from '@components/guards/PermissionGuard';

import styles from './SideNavBar.module.css';

const Icon = ({ name }) => {
  const paths = {
    dashboard: (
      <>
        <rect x="2" y="2" width="5" height="5" rx="1" />
        <rect x="9" y="2" width="5" height="5" rx="1" />
        <rect x="2" y="9" width="5" height="5" rx="1" />
        <rect x="9" y="9" width="5" height="5" rx="1" />
      </>
    ),

    analytics: (
      <>
        <path d="M2 14V2" />
        <path d="M2 14H14" />
        <path d="M4 10L7 6L9 8L13 3" />
      </>
    ),

    hotel: (
      <>
        <path d="M2 13V5C2 3.9 2.9 3 4 3H12C13.1 3 14 3.9 14 5V13" />
        <path d="M2 10H14" />
        <path d="M5 7H7" />
      </>
    ),

    restaurant: (
      <>
        <path d="M4 2V7" />
        <path d="M2 2V5C2 6.1 2.9 7 4 7C5.1 7 6 6.1 6 5V2" />
        <path d="M4 7V14" />
        <path d="M11 2V14" />
        <path d="M11 2C13 3 14 4.5 14 6.5C14 7.8 12.9 8.5 11 8.5" />
      </>
    ),

    inventory: (
      <>
        <path d="M3 5L8 2L13 5V11L8 14L3 11V5Z" />
        <path d="M3 5L8 8L13 5" />
        <path d="M8 8V14" />
      </>
    ),

    customers: (
      <>
        <circle cx="6" cy="5" r="2.5" />
        <path d="M1.5 13C1.5 10.8 3.5 9 6 9C8.5 9 10.5 10.8 10.5 13" />
        <path d="M11 3.5C13 3.7 14.5 5.2 14.5 7.2" />
        <path d="M11.5 9.5C13.2 10 14.2 11.1 14.5 13" />
      </>
    ),

    finance: (
      <>
        <path d="M2 12V8" />
        <path d="M6 12V5" />
        <path d="M10 12V7" />
        <path d="M14 12V2" />
      </>
    ),

    staff: (
      <>
        <circle cx="6" cy="5" r="2.5" />
        <path d="M1.5 14C1.5 11.5 3.5 9.5 6 9.5C8.5 9.5 10.5 11.5 10.5 14" />
        <path d="M11 5.5C11.9 4.8 13.2 5 13.8 5.9" />
        <path d="M11.5 10.5C13 11 14 12.2 14 14" />
      </>
    ),

    admin: (
      <>
        <circle cx="8" cy="8" r="2.5" />
        <path d="M8 2V3.5" />
        <path d="M8 12.5V14" />
        <path d="M2 8H3.5" />
        <path d="M12.5 8H14" />
        <path d="M3.8 3.8L4.9 4.9" />
        <path d="M11.1 11.1L12.2 12.2" />
        <path d="M12.2 3.8L11.1 4.9" />
        <path d="M4.9 11.1L3.8 12.2" />
      </>
    ),

    maintenance: (
      <>
        <path d="M9.5 4.5C9.5 5.9 8.4 7 7 7C6.7 7 6.4 6.9 6.1 6.8L2.4 10.5C2.2 10.7 2.2 11.1 2.4 11.3L4.3 13.1C4.4 13.3 4.8 13.3 5 13.1L8.7 9.4" />
        <path d="M10 6L13.5 2.5L11.5 0.5L8 4L10 6Z" />
      </>
    ),

    notifications: (
      <>
        <path d="M4 6C4 3.8 5.6 2 8 2C10.4 2 12 3.8 12 6V9L14 11H2L4 9V6Z" />
        <path d="M6.5 13C6.8 13.7 7.3 14 8 14C8.7 14 9.2 13.7 9.5 13" />
      </>
    ),

    chevron: (
      <path d="M6 4L10 8L6 12" />
    ),

    logout: (
      <>
        <path d="M6 2H3.5C2.7 2 2 2.7 2 3.5V12.5C2 13.3 2.7 14 3.5 14H6" />
        <path d="M10 5L13 8L10 11" />
        <path d="M13 8H6" />
      </>
    ),
  };

  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      {React.cloneElement(
        <g>{paths[name]}</g>,
        {
          stroke: 'currentColor',
          strokeWidth: '1.5',
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        }
      )}
    </svg>
  );
};

const navigationGroups = [
  {
    id: 'hotel',
    title: 'Hotel',
    icon: 'hotel',
    items: [
      {
        path: '/hotel/reservations',
        label: 'Reservations',
        permission: 'BOOKING_READALL',
      },
      {
        path: '/hotel/check-in',
        label: 'Express Check-In',
        permission: 'BOOKING_CREATE_CHECK_IN',
      },
      {
        path: '/hotel/rooms',
        label: 'Rooms & Floors',
        permission: 'ROOM_READALL',
      },
      {
        path: '/hotel/room-types',
        label: 'Room Types',
        permission: 'ROOM_TYPE_READALL',
      },
      {
        path: '/hotel/amenities',
        label: 'Amenities',
        permission: 'AMENITY_READALL',
      },
      {
        path: '/hotel/extra-services',
        label: 'Extra Services',
        permission: 'EXTRA_SERVICE_FOR_HOTEL_READALL',
      },
      {
        path: '/hotel/guests',
        label: 'Guest Directory',
        permission: 'HOTEL_GUEST_READALL',
      },
    ],
  },

  {
    id: 'restaurant',
    title: 'Restaurant',
    icon: 'restaurant',
    items: [
      {
        path: '/hotel/restaurant/pos',
        label: 'POS Terminal',
      },
      {
        path: '/hotel/restaurant/orders',
        label: 'Orders',
      },
      {
        path: '/hotel/restaurant/menu',
        label: 'Menu Catalog',
      },
      {
        path: '/hotel/restaurant/kds',
        label: 'Kitchen (KDS)',
      },
      {
        path: '/hotel/restaurant/tables',
        label: 'Tables & Areas',
      },
      {
        path: '/hotel/restaurant/analytics',
        label: 'Restaurant Analytics',
      },
    ],
  },

  {
    id: 'inventory',
    title: 'Inventory & Supply',
    icon: 'inventory',
    items: [
      {
        path: '/hotel/inventory/products',
        label: 'Products',
      },
      {
        path: '/hotel/inventory/stock',
        label: 'Stock',
      },
      {
        path: '/hotel/inventory/suppliers',
        label: 'Suppliers',
      },
      {
        path: '/hotel/inventory/purchase-orders',
        label: 'Purchase Orders',
      },
    ],
  },

  {
    id: 'customers-billing',
    title: 'Customers & Billing',
    icon: 'customers',
    items: [
      {
        path: '/hotel/customers/directory',
        label: 'Customer CRM',
      },
      {
        path: '/hotel/customers/loyalty',
        label: 'Customer Loyalty',
      },
      {
        path: '/hotel/billing/invoices',
        label: 'Invoices & Billing',
        permission: 'INVOICE_READALL',
      },
      {
        path: '/hotel/billing/payments',
        label: 'Payment Processing',
        permission: 'PAYMENT_READALL',
      },
      {
        path: '/hotel/billing/reports',
        label: 'Revenue Reports',
      },
      {
        path: '/settings/billing-invoices',
        label: 'Billing Settings',
      },
    ],
  },

  {
    id: 'finance',
    title: 'Finance',
    icon: 'finance',
    items: [
      {
        path: '/hotel/finance/monthly-salary',
        label: 'Yearly Salary Summary',
      },
      {
        path: '/hotel/finance/cash-register',
        label: 'Cash Register',
      },
    ],
  },

  {
    id: 'staff',
    title: 'Staff',
    icon: 'staff',
    items: [
      {
        path: '/hotel/staff/salary',
        label: 'Staff & Salary',
      },
      {
        path: '/hotel/staff/attendance',
        label: 'Attendance',
      },
      {
        path: '/hotel/staff/advances',
        label: 'Advances',
      },
      {
        path: '/hotel/staff/housekeeping',
        label: 'Housekeeping',
      },
    ],
  },

  {
    id: 'administration',
    title: 'Administration',
    icon: 'admin',
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
        path: '/admin/modules',
        label: 'Modules',
      },
      {
        path: '/admin/sub-modules',
        label: 'Sub-Modules',
      },
      {
        path: '/admin/module-permissions',
        label: 'Module Permissions',
      },
      {
        path: '/admin/branches',
        label: 'Branches',
      },
      {
        path: '/admin/subscription',
        label: 'Subscription Plans',
      },
      {
        path: '/admin/settings',
        label: 'Settings',
      },
    ],
  },

  {
    id: 'maintenance',
    title: 'Maintenance',
    icon: 'maintenance',
    items: [
      {
        path: '/hotel/maintenance',
        label: 'Maintenance Dashboard',
      },
    ],
  },
];

const findGroupForPath = (pathname) =>
  navigationGroups.find((group) =>
    group.items.some(
      (item) =>
        pathname === item.path ||
        pathname.startsWith(`${item.path}/`)
    )
  )?.id;

export default function SideNavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  let activeUser = user;
  if (!activeUser) {
    try {
      const storedUser = localStorage.getItem('syncstays_user');
      if (storedUser) {
        activeUser = JSON.parse(storedUser);
      }
    } catch {
      activeUser = null;
    }
  }

  const handleLogout = async (e) => {
    e.preventDefault();
    await logout();
    navigate('/login', { replace: true });
  };

  const isSuperAdmin = activeUser?.role === 'super-admin';
  const isHotelUser = activeUser?.role !== 'super-admin' && Boolean(activeUser?.organizationId);

  // Role-based sidebar isolation with safe fallback:
  // Super Admin -> Show Administration group
  // Valid Hotel User -> Show Hotel operational groups
  // Unknown / uninitialized / malformed user -> Safe fallback (show zero role-specific groups)
  const visibleGroups = useMemo(() => {
    if (isSuperAdmin) {
      return navigationGroups.filter((group) => group.id === 'administration');
    }
    if (isHotelUser) {
      return navigationGroups.filter((group) => group.id !== 'administration');
    }
    return [];
  }, [isSuperAdmin, isHotelUser]);

  const activeGroup = useMemo(
    () => findGroupForPath(location.pathname),
    [location.pathname]
  );

  const [openGroups, setOpenGroups] = useState(() =>
    activeGroup ? [activeGroup] : []
  );

  const prevPathRef = useRef(location.pathname);

  // Auto-expand matching group only when the user navigates to a new route
  useEffect(() => {
    if (prevPathRef.current !== location.pathname) {
      prevPathRef.current = location.pathname;
      if (activeGroup) {
        setOpenGroups((current) =>
          current.includes(activeGroup) ? current : [...current, activeGroup]
        );
      }
    }
  }, [location.pathname, activeGroup]);

  const toggleGroup = (groupId) => {
    setOpenGroups((current) =>
      current.includes(groupId)
        ? current.filter((id) => id !== groupId)
        : [...current, groupId]
    );
  };

  const isActive = (path) =>
    location.pathname === path ||
    location.pathname.startsWith(`${path}/`);

  return (
    <aside
      className={styles.sidebar}
      data-testid="sidebar-nav"
    >
      {/* Brand */}
      <div className={styles.brandBlock}>
        <div className={styles.brandMark}>
          GH
        </div>

        <div>
          <h1 className={styles.brandTitle}>
            Grand Horizon
          </h1>

          <span className={styles.brandSubtitle}>
            SyncStays Platform
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className={styles.navContainer}>
        <div className={styles.sectionLabel}>
          Overview
        </div>

        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `${styles.topLevelLink} ${isActive ? styles.active : ''
            }`
          }
        >
          <span className={styles.navIcon}>
            <Icon name="dashboard" />
          </span>

          Dashboard
        </NavLink>

        <NavLink
          to="/hotel/analytics"
          className={({ isActive }) =>
            `${styles.topLevelLink} ${isActive ? styles.active : ''
            }`
          }
        >
          <span className={styles.navIcon}>
            <Icon name="analytics" />
          </span>

          Analytics
        </NavLink>

        {visibleGroups.length > 0 && (
          <div className={styles.sectionLabel}>
            {isSuperAdmin ? 'Administration' : 'Operations'}
          </div>
        )}

        <div className={styles.groups}>
          {visibleGroups.map((group) => {
            const open = openGroups.includes(group.id);
            const groupActive = group.id === activeGroup;

            return (
              <div
                key={group.id}
                className={`${styles.navGroup} ${groupActive ? styles.groupActive : ''
                  }`}
              >
                <button
                  type="button"
                  className={styles.groupButton}
                  onClick={() => toggleGroup(group.id)}
                  aria-expanded={open}
                >
                  <span className={styles.groupLeft}>
                    <span className={styles.navIcon}>
                      <Icon name={group.icon} />
                    </span>

                    <span>
                      {group.title}
                    </span>
                  </span>

                  <span
                    className={`${styles.chevron} ${open ? styles.chevronOpen : ''
                      }`}
                  >
                    <Icon name="chevron" />
                  </span>
                </button>

                {open && (
                  <div className={styles.submenu}>
                    {group.items
                      .filter(
                        (item) =>
                          !item.permission ||
                          hasPermission(activeUser, item.permission)
                      )
                      .map((item) => (
                        <NavLink
                          key={item.path}
                          to={item.path}
                          className={`${styles.submenuLink} ${isActive(item.path)
                              ? styles.submenuActive
                              : ''
                            }`}
                        >
                          <span className={styles.submenuDot} />
                          {item.label}
                        </NavLink>
                      ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className={styles.footerBlock}>
        <NavLink
          to="/notifications"
          className={({ isActive }) =>
            `${styles.footerLink} ${isActive ? styles.active : ''
            }`
          }
        >
          <Icon name="notifications" />
          Notifications
        </NavLink>

        <button
          type="button"
          onClick={handleLogout}
          className={styles.footerLink}
          style={{
            background: 'none',
            border: 'none',
            width: '100%',
            cursor: 'pointer',
            textAlign: 'left',
            font: 'inherit',
          }}
        >
          <Icon name="logout" />
          Logout
        </button>
      </div>
    </aside>
  );
}