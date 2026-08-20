/**
 * @file router.jsx
 * @description React Router v6 master configuration for SyncStays.
 */

import React from 'react';
import {
  createBrowserRouter,
  Navigate,
} from 'react-router-dom';

/* Layout Shell */
import MainLayout from '@layouts/MainLayout/MainLayout';

/* Public Auth Pages */
import LoginPage from '@pages/Auth/Login/Index';
import RegisterPage from '@pages/Auth/Register/Index';
import ForgotPasswordPage from '@pages/Auth/ForgotPassword/Index';

/* Authenticated Domain Pages */
import DashboardPage from '@pages/Dashboard/Index';
import AnalyticsPage from '@pages/Analytics/Index';

/* Hotel Domain */
import HotelRoomsPage from '@pages/Hotel/Rooms/Index';
import HotelRoomTypesPage from '@pages/Hotel/RoomTypes/Index';
import HotelAmenitiesPage from '@pages/Hotel/Amenities/Index';
import HotelExtraServicesPage from '@pages/Hotel/ExtraServices/Index';
import RoomOccupancyTimelinePage from '@pages/Hotel/Rooms/OccupancyTimeline';
import HotelGuestsPage from '@pages/Hotel/Guests/Index';
import GuestDetailsPage from '@pages/Hotel/Guests/Details/Index';
import HotelReservationsPage from '@pages/Hotel/Reservations/Index';
import HotelCheckInPage from '@pages/Hotel/CheckIn/Index';

/* Restaurant Domain */
import RestaurantPOSPage from '@pages/Restaurant/POS/Index';
import RestaurantOrdersPage from '@pages/Restaurant/Orders/Index';
import RestaurantMenuPage from '@pages/Restaurant/Menu/Index';
import RestaurantSecurityPage from '@pages/Restaurant/Security/Index';
import RestaurantKDSPage from '@pages/Restaurant/KDS/Index';
import RestaurantTablesPage from '@pages/Restaurant/Tables/Index';
import RestaurantAnalyticsPage from '@pages/Restaurant/Analytics/Index';

/* Inventory & Purchasing Domain */
import InventoryProductsPage from '@pages/Inventory/Products/Index';
import InventoryStockPage from '@pages/Inventory/Stock/Index';
import InventorySuppliersPage from '@pages/Inventory/Suppliers/Index';
import InventoryPurchaseOrdersPage from '@pages/Inventory/PurchaseOrders/Index';

/* Customers Domain */
import CustomersDirectoryPage from '@pages/Customers/Directory/Index';
import CustomersLoyaltyPage from '@pages/Customers/Loyalty/Index';

/* Billing Domain */
import BillingInvoicesPage from '@pages/Billing/Invoices/Index';
import BillingPaymentsPage from '@pages/Billing/Payments/Index';
import BillingReportsPage from '@pages/Billing/Reports/Index';

/* Settings */
import BillingInvoicesSettingsPage from '@pages/Settings/BillingInvoices/Index';

/* Notifications & Audit */
import NotificationsPage from '@pages/Notifications/Index';
import AuditLogsPage from '@pages/AuditLogs/Index';

/* Administration */
import AdminUsersPage from '@pages/Admin/Users/Index';
import AdminRBACPage from '@pages/Admin/RBAC/Index';
import AdminBranchesPage from '@pages/Admin/Branches/Index';
import AdminSubscriptionPage from '@pages/Admin/Subscription/Index';
import AdminSettingsPage from '@pages/Admin/Settings/Index';

/* Staff & Housekeeping */
import StaffAttendancePage from '@pages/Staff/Attendance/Index';
import StaffAdvancesPage from '@pages/Staff/Advances/Index';
import HousekeepingPage from '@pages/Staff/Housekeeping/Index';
import StaffSalaryPage from '@pages/Staff/Salary/Index';

/* Finance */
import MonthlySalaryPage from '@pages/Finance/MonthlySalary/Index';
import CashRegisterPage from '@pages/Finance/CashRegister/Index';

/* Maintenance */
import MaintenanceDashboardPage from '@pages/Maintenance/Index';

export const router = createBrowserRouter([
  /* =========================
     PUBLIC AUTH ROUTES
     ========================= */

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

  /* =========================
     AUTHENTICATED APPLICATION
     ========================= */

  {
    path: '/',
    element: <MainLayout />,

    children: [
      /* =========================
         OVERVIEW
         ========================= */

      {
        index: true,
        element: <DashboardPage />,
      },

      {
        path: 'analytics',
        element: <AnalyticsPage />,
      },

      /* =========================
         HOTEL
         ========================= */

      {
        path: 'hotel/rooms',
        element: <HotelRoomsPage />,
      },

      {
        path: 'hotel/room-types',
        element: <HotelRoomTypesPage />,
      },
      {
        path: 'hotel/amenities',
        element: <HotelAmenitiesPage />,
      },
      {
        path: 'hotel/extra-services',
        element: <HotelExtraServicesPage />,
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
        path: 'hotel/guests/:guestId',
        element: <GuestDetailsPage />,
      },

      {
        path: 'hotel/reservations',
        element: <HotelReservationsPage />,
      },

      {
        path: 'hotel/check-in',
        element: <HotelCheckInPage />,
      },

      /* =========================
         RESTAURANT
         ========================= */

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
        path: 'restaurant/security',
        element: <RestaurantSecurityPage />,
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

      /* =========================
         INVENTORY & SUPPLY
         ========================= */

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

      /* =========================
         CUSTOMERS
         ========================= */

      {
        path: 'customers/directory',
        element: <CustomersDirectoryPage />,
      },

      {
        path: 'customers/loyalty',
        element: <CustomersLoyaltyPage />,
      },

      /* =========================
         BILLING
         ========================= */

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

      /* =========================
         SETTINGS
         ========================= */

      {
        path: 'settings/billing-invoices',
        element: <BillingInvoicesSettingsPage />,
      },

      {
        path: 'settings/billing',
        element: (
          <Navigate
            to="/settings/billing-invoices"
            replace
          />
        ),
      },

      /* =========================
         NOTIFICATIONS & AUDIT
         ========================= */

      {
        path: 'notifications',
        element: <NotificationsPage />,
      },

      {
        path: 'audit-logs',
        element: <AuditLogsPage />,
      },

      /* =========================
         ADMINISTRATION
         ========================= */

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

      /* =========================
         FINANCE
         ========================= */

      {
        path: 'finance/monthly-salary',
        element: <MonthlySalaryPage />,
      },

      {
        path: 'finance/cash-register',
        element: <CashRegisterPage />,
      },

      /* =========================
         STAFF
         ========================= */

      {
        path: 'staff/salary',
        element: <StaffSalaryPage />,
      },

      {
        path: 'staff/attendance',
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

      /* =========================
         MAINTENANCE
         ========================= */

      {
        path: 'maintenance',
        element: <MaintenanceDashboardPage />,
      },

      {
        path: 'maintenance/dashboard',
        element: (
          <Navigate
            to="/maintenance"
            replace
          />
        ),
      },

      /* =========================
         LEGACY REDIRECTS
         ========================= */

      {
        path: 'rooms',
        element: (
          <Navigate
            to="/hotel/rooms"
            replace
          />
        ),
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
        path: 'staff/Attendence',
        element: (
          <Navigate
            to="/staff/attendance"
            replace
          />
        ),
      },

      {
        path: 'staff/Attendance',
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

  /* =========================
     FALLBACK
     ========================= */

  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

export default router;