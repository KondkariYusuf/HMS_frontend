/**
 * @file router.jsx
 * @description React Router v6 master configuration for SyncStays.
 */

import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

/* Layout Shell */
import MainLayout from '@layouts/MainLayout/MainLayout';

/* Public Auth Pages */
import LoginPage from '@pages/Auth/Login/Index';
import RegisterPage from '@pages/Auth/Register/Index';
import ForgotPasswordPage from '@pages/Auth/ForgotPassword/Index';

/* Authenticated Domain Pages */
import DashboardPage from '@pages/Dashboard/Index';
import AnalyticsPage from '@pages/Analytics/Index';

/* 1. Hotel Domain */
import HotelRoomsPage from '@pages/Hotel/Rooms/Index';
import RoomOccupancyTimelinePage from '@pages/Hotel/Rooms/OccupancyTimeline';
import HotelGuestsPage from '@pages/Hotel/Guests/Index';
import HotelReservationsPage from '@pages/Hotel/Reservations/Index';
import HotelCheckInPage from '@pages/Hotel/CheckIn/Index';

/* 2. Restaurant Domain */
import RestaurantPOSPage from '@pages/Restaurant/POS/Index';
import RestaurantOrdersPage from '@pages/Restaurant/Orders/Index';
import RestaurantMenuPage from '@pages/Restaurant/Menu/Index';
import RestaurantKDSPage from '@pages/Restaurant/KDS/Index';
import RestaurantTablesPage from '@pages/Restaurant/Tables/Index';
import RestaurantAnalyticsPage from '@pages/Restaurant/Analytics/Index';

/* 3. Inventory & Purchasing Domain */
import InventoryProductsPage from '@pages/Inventory/Products/Index';
import InventoryStockPage from '@pages/Inventory/Stock/Index';
import InventorySuppliersPage from '@pages/Inventory/Suppliers/Index';
import InventoryPurchaseOrdersPage from '@pages/Inventory/PurchaseOrders/Index';

/* 4. Customers Domain */
import CustomersDirectoryPage from '@pages/Customers/Directory/Index';
import CustomersLoyaltyPage from '@pages/Customers/Loyalty/Index';

/* 5. Billing Domain */
import BillingInvoicesPage from '@pages/Billing/Invoices/Index';
import BillingPaymentsPage from '@pages/Billing/Payments/Index';
import BillingReportsPage from '@pages/Billing/Reports/Index';
import SettingsBillingInvoicesPage from '@pages/Settings/BillingInvoices/Index';

/* 6. Notifications & Audit Domain */
import NotificationsPage from '@pages/Notifications/Index';
import AuditLogsPage from '@pages/AuditLogs/Index';

/* 7. Administration Domain */
import AdminUsersPage from '@pages/Admin/Users/Index';
import AdminRBACPage from '@pages/Admin/RBAC/Index';
import AdminBranchesPage from '@pages/Admin/Branches/Index';
import AdminSubscriptionPage from '@pages/Admin/Subscription/Index';
import AdminSettingsPage from '@pages/Admin/Settings/Index';

/* 8. Staff & Housekeeping Domain */
import StaffAttendancePage from '@pages/Staff/Attendance/Index';
import StaffAdvancesPage from '@pages/Staff/Advances/Index';
import HousekeepingPage from '@pages/Staff/Housekeeping/Index';
import StaffSalaryPage from '@pages/Staff/Salary/Index';

/* 9. Finance Domain */
import MonthlySalaryPage from '@pages/Finance/MonthlySalary/Index';
import CashRegisterPage from '@pages/Finance/CashRegister/Index';

/* 10. Maintenance Domain */
import MaintenanceDashboardPage from '@pages/Maintenance/Index';

export const router = createBrowserRouter([
  /* Public Auth Routes */
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },

  /* Authenticated Application */
  {
    path: '/',
    element: <MainLayout />,
    children: [
      /* Dashboard */
      {
        index: true,
        element: <DashboardPage />,
      },

      /* Analytics */
      {
        path: 'analytics',
        element: <AnalyticsPage />,
      },

      /* Finance Domain Routes */
      {
        path: 'finance/monthly-salary',
        element: <MonthlySalaryPage />,
      },
      {
        path: 'finance/cash-register',
        element: <CashRegisterPage />,
      },

      /* Hotel Domain Routes */
      {
        path: 'hotel/rooms',
        element: <HotelRoomsPage />,
      },
      {
        path: 'hotel/rooms/occupancy-timeline',
        element: <RoomOccupancyTimelinePage />,
      },
      {
        path: 'hotel/guests',
        element: <HotelGuestsPage />,
      },
      {
        path: 'hotel/reservations',
        element: <HotelReservationsPage />,
      },
      {
        path: 'hotel/check-in',
        element: <HotelCheckInPage />,
      },

      /* Restaurant Domain Routes */
      {
        path: 'restaurant/pos',
        element: <RestaurantPOSPage />,
      },
      {
        path: 'restaurant/orders',
        element: <RestaurantOrdersPage />,
      },
      {
        path: 'restaurant/menu',
        element: <RestaurantMenuPage />,
      },
      {
        path: 'restaurant/kds',
        element: <RestaurantKDSPage />,
      },
      {
        path: 'restaurant/tables',
        element: <RestaurantTablesPage />,
      },
      {
        path: 'restaurant/analytics',
        element: <RestaurantAnalyticsPage />,
      },

      /* Inventory & Purchasing Routes */
      {
        path: 'inventory/products',
        element: <InventoryProductsPage />,
      },
      {
        path: 'inventory/stock',
        element: <InventoryStockPage />,
      },
      {
        path: 'inventory/suppliers',
        element: <InventorySuppliersPage />,
      },
      {
        path: 'inventory/purchase-orders',
        element: <InventoryPurchaseOrdersPage />,
      },

      /* Customers & Loyalty Routes */
      {
        path: 'customers/directory',
        element: <CustomersDirectoryPage />,
      },
      {
        path: 'customers/loyalty',
        element: <CustomersLoyaltyPage />,
      },

      /* Billing Routes */
      {
        path: 'billing/invoices',
        element: <BillingInvoicesPage />,
      },
      {
        path: 'billing/payments',
        element: <BillingPaymentsPage />,
      },
      {
        path: 'billing/reports',
        element: <BillingReportsPage />,
      },

      /* Settings Routes */
      {
        path: 'settings/billing-invoices',
        element: <SettingsBillingInvoicesPage />,
      },

      /* Notifications & Audit Routes */
      {
        path: 'notifications',
        element: <NotificationsPage />,
      },
      {
        path: 'audit-logs',
        element: <AuditLogsPage />,
      },

      /* Administration Routes */
      {
        path: 'admin/users',
        element: <AdminUsersPage />,
      },
      {
        path: 'admin/rbac',
        element: <AdminRBACPage />,
      },
      {
        path: 'admin/branches',
        element: <AdminBranchesPage />,
      },
      {
        path: 'admin/subscription',
        element: <AdminSubscriptionPage />,
      },
      {
        path: 'admin/settings',
        element: <AdminSettingsPage />,
      },

      /* Staff & Housekeeping Routes */
      {
        path: 'staff/Attendance',
        element: <StaffAttendancePage />,
      },
      {
        path: 'staff/advances',
        element: <StaffAdvancesPage />,
      },
      {
        path: 'staff/housekeeping',
        element: <HousekeepingPage />,
      },
      {
        path: 'staff/salary',
        element: <StaffSalaryPage />,
      },

      /* Maintenance Routes */
      {
        path: 'maintenance',
        element: <MaintenanceDashboardPage />,
      },

      /* Legacy Route Redirects */
      {
        path: 'rooms',
        element: <Navigate to="/hotel/rooms" replace />,
      },
      {
        path: 'rooms/occupancy-timeline',
        element: (
          <Navigate
            to="/hotel/rooms/occupancy-timeline"
            replace
          />
        ),
      },
      {
        path: 'reservations',
        element: (
          <Navigate
            to="/hotel/reservations"
            replace
          />
        ),
      },
      {
        path: 'staff',
        element: (
          <Navigate
            to="/staff/attendance"
            replace
          />
        ),
      },
      {
        path: 'settings',
        element: (
          <Navigate
            to="/admin/settings"
            replace
          />
        ),
      },
    ],
  },
]);

export default router;