/**
 * @file navigation.js
 * @description Centralized navigation configuration for the SyncStays HMS frontend.
 * @designReference Navigation - SideNavBar
 */

/**
 * @typedef {Object} NavigationItem
 * @property {string} path - Route path.
 * @property {string} label - Display label.
 * @property {string} icon - Navigation icon identifier.
 */

/**
 * @typedef {Object} NavigationGroup
 * @property {string} key - Unique group identifier.
 * @property {string} title - Display title.
 * @property {string} icon - Group icon identifier.
 * @property {NavigationItem[]} items - Child navigation items.
 */

/**
 * Main application navigation groups.
 *
 * @type {NavigationGroup[]}
 */
export const navigationGroups = [
    {
        key: 'hotel',
        title: 'Hotel',
        icon: 'bed',
        items: [
            {
                path: '/hotel/reservations',
                label: 'Reservations',
                icon: 'calendar',
            },
            {
                path: '/hotel/check-in',
                label: 'Express Check-In',
                icon: 'calendar',
            },
            {
                path: '/hotel/rooms',
                label: 'Rooms & Floors',
                icon: 'bed',
            },
            {
                path: '/hotel/guests',
                label: 'Guest Directory',
                icon: 'users',
            },
        ],
    },

    {
        key: 'restaurant',
        title: 'Restaurant',
        icon: 'restaurant',
        items: [
            {
                path: '/restaurant/pos',
                label: 'POS Terminal',
                icon: 'calendar',
            },
            {
                path: '/restaurant/menu',
                label: 'Menu Catalog',
                icon: 'calendar',
            },
            {
                path: '/restaurant/kds',
                label: 'Kitchen (KDS)',
                icon: 'calendar',
            },
            {
                path: '/restaurant/tables',
                label: 'Tables & Areas',
                icon: 'calendar',
            },
        ],
    },

    {
        key: 'inventory',
        title: 'Inventory & Supply',
        icon: 'box',
        items: [
            {
                path: '/inventory/products',
                label: 'Products',
                icon: 'box',
            },
            {
                path: '/inventory/suppliers',
                label: 'Suppliers',
                icon: 'users',
            },
            {
                path: '/inventory/purchase-orders',
                label: 'Purchase Orders',
                icon: 'calendar',
            },
        ],
    },

    {
        key: 'customers',
        title: 'Customers & Billing',
        icon: 'users',
        items: [
            {
                path: '/customers/directory',
                label: 'Customer CRM',
                icon: 'users',
            },
            {
                path: '/billing/invoices',
                label: 'Invoices & Billing',
                icon: 'calendar',
            },
            {
                path: '/billing/reports',
                label: 'Revenue Reports',
                icon: 'bar-chart',
            },
            {
                path: '/settings/billing-invoices',
                label: 'Billing Settings',
                icon: 'gear',
            },
        ],
    },

    {
        key: 'finance',
        title: 'Finance',
        icon: 'bar-chart',
        items: [
            {
                path: '/finance/monthly-salary',
                label: 'Salary Summary',
                icon: 'bar-chart',
            },
            {
                path: '/finance/cash-register',
                label: 'Cash Register',
                icon: 'calendar',
            },
        ],
    },

    {
        key: 'staff',
        title: 'Staff',
        icon: 'users',
        items: [
            {
                path: '/staff/salary',
                label: 'Staff & Salary',
                icon: 'users',
            },
            {
                path: '/staff/Attendance',
                label: 'Attendance',
                icon: 'calendar',
            },
            {
                path: '/staff/advances',
                label: 'Advances',
                icon: 'calendar',
            },
            {
                path: '/staff/housekeeping',
                label: 'Housekeeping',
                icon: 'bed',
            },
        ],
    },

    {
        key: 'administration',
        title: 'Administration',
        icon: 'gear',
        items: [
            {
                path: '/admin/users',
                label: 'User Directory',
                icon: 'users',
            },
            {
                path: '/admin/rbac',
                label: 'RBAC Roles',
                icon: 'users',
            },
            {
                path: '/admin/branches',
                label: 'Branches',
                icon: 'bed',
            },
            {
                path: '/admin/settings',
                label: 'Settings',
                icon: 'gear',
            },
        ],
    },

    {
        key: 'maintenance',
        title: 'Maintenance',
        icon: 'wrench',
        items: [
            {
                path: '/maintenance',
                label: 'Maintenance Dashboard',
                icon: 'wrench',
            },
        ],
    },
];

export const PRIMARY_NAVIGATION = [
    {
        path: '/',
        label: 'Dashboard',
        icon: 'dashboard',
    },
    {
        path: '/analytics',
        label: 'Analytics',
        icon: 'chart-line',
    },
];

export const FOOTER_NAVIGATION = [
    {
        path: '/notifications',
        label: 'Notifications',
    },
];