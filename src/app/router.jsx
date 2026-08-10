/**
 * @file router.jsx
 * @description React Router v6 master configuration mapping all SyncStays 9 domain modules.
 */
import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

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
import HotelGuestsPage from '@pages/Hotel/Guests/Index';
import HotelReservationsPage from '@pages/Hotel/Reservations/Index';
import HotelCheckInPage from '@pages/Hotel/CheckIn/Index';

/* 2. Restaurant Domain */
import RestaurantPOSPage from '@pages/Restaurant/POS/Index';
import RestaurantMenuPage from '@pages/Restaurant/Menu/Index';
import RestaurantKDSPage from '@pages/Restaurant/KDS/Index';
import RestaurantTablesPage from '@pages/Restaurant/Tables/Index';

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

/* 6. Notifications & Audit Domain */
import NotificationsPage from '@pages/Notifications/Index';
import AuditLogsPage from '@pages/AuditLogs/Index';

/* 7. Administration Domain */
import AdminUsersPage from '@pages/Admin/Users/Index';
import AdminRBACPage from '@pages/Admin/RBAC/Index';
import AdminBranchesPage from '@pages/Admin/Branches/Index';
import AdminSubscriptionPage from '@pages/Admin/Subscription/Index';
import AdminSettingsPage from '@pages/Admin/Settings/Index';

import MonthlySalaryPage from '@pages/Finance/MonthlySalary/Index';

export const router = createBrowserRouter([
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
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'analytics',
        element: <AnalyticsPage />,
      },
      {
        path: 'finance/monthly-salary',
        element: <MonthlySalaryPage />,
      },

      /* Hotel Domain Routes */
      { path: 'hotel/rooms', element: <HotelRoomsPage /> },
      { path: 'hotel/guests', element: <HotelGuestsPage /> },
      { path: 'hotel/reservations', element: <HotelReservationsPage /> },
      { path: 'hotel/check-in', element: <HotelCheckInPage /> },

      /* Restaurant Domain Routes */
      { path: 'restaurant/pos', element: <RestaurantPOSPage /> },
      { path: 'restaurant/menu', element: <RestaurantMenuPage /> },
      { path: 'restaurant/kds', element: <RestaurantKDSPage /> },
      { path: 'restaurant/tables', element: <RestaurantTablesPage /> },

      /* Inventory & Purchasing Routes */
      { path: 'inventory/products', element: <InventoryProductsPage /> },
      { path: 'inventory/stock', element: <InventoryStockPage /> },
      { path: 'inventory/suppliers', element: <InventorySuppliersPage /> },
      {
        path: 'inventory/purchase-orders',
        element: <InventoryPurchaseOrdersPage />,
      },

      /* Customers & Loyalty Routes */
      { path: 'customers/directory', element: <CustomersDirectoryPage /> },
      { path: 'customers/loyalty', element: <CustomersLoyaltyPage /> },

      /* Billing Routes */
      { path: 'billing/invoices', element: <BillingInvoicesPage /> },
      { path: 'billing/payments', element: <BillingPaymentsPage /> },
      { path: 'billing/reports', element: <BillingReportsPage /> },

      /* Notifications & Audit Routes */
      { path: 'notifications', element: <NotificationsPage /> },
      { path: 'audit-logs', element: <AuditLogsPage /> },

      /* Administration Routes */
      { path: 'admin/users', element: <AdminUsersPage /> },
      { path: 'admin/rbac', element: <AdminRBACPage /> },
      { path: 'admin/branches', element: <AdminBranchesPage /> },
      { path: 'admin/subscription', element: <AdminSubscriptionPage /> },
      { path: 'admin/settings', element: <AdminSettingsPage /> },

      /* Fallback Legacy Aliases */
      { path: 'rooms', element: <HotelRoomsPage /> },
      { path: 'reservations', element: <HotelReservationsPage /> },
      { path: 'staff', element: <AdminUsersPage /> },
      { path: 'settings', element: <AdminSettingsPage /> },
    ],
  },
]);

export default router;
