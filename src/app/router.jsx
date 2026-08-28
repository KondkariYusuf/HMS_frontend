/**
 * @file router.jsx
 * @description React Router v6 master configuration for SyncStays.
 */

import React from 'react';
import {
  createBrowserRouter,
  Navigate,
} from 'react-router-dom';

/* Layout Shell & Guards */
import MainLayout from '@layouts/MainLayout/MainLayout';
import HotelGuard from '@components/guards/HotelGuard';
import PermissionGuard from '@components/guards/PermissionGuard';

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
import AdminModulesPage from '@pages/Admin/Modules/Index';
import AdminSubModulesPage from '@pages/Admin/SubModules/Index';
import AdminModulePermissionsPage from '@pages/Admin/ModulePermissions/Index';
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
        element: (
          <Navigate
            to="/hotel/analytics"
            replace
          />
        ),
      },

      /* =========================
         HOTEL (PROTECTED BY HOTELGUARD)
         ========================= */

      {
        element: <HotelGuard />,
        children: [
          {
            path: 'hotel/dashboard',
            element: <DashboardPage />,
          },

          {
            path: 'hotel/analytics',
            element: <AnalyticsPage />,
          },

          {
            path: 'hotel/rooms',
            element: (
              <PermissionGuard code="ROOM_READALL">
                <HotelRoomsPage />
              </PermissionGuard>
            ),
          },

          {
            path: 'hotel/room-types',
            element: (
              <PermissionGuard code="ROOM_TYPE_READALL">
                <HotelRoomTypesPage />
              </PermissionGuard>
            ),
          },
          {
            path: 'hotel/amenities',
            element: (
              <PermissionGuard code="AMENITY_READALL">
                <HotelAmenitiesPage />
              </PermissionGuard>
            ),
          },
          {
            path: 'hotel/extra-services',
            element: (
              <PermissionGuard code="EXTRA_SERVICE_FOR_HOTEL_READALL">
                <HotelExtraServicesPage />
              </PermissionGuard>
            ),
          },
          {
            path: 'hotel/rooms/occupancy-timeline',
            element: <RoomOccupancyTimelinePage />,
          },

          {
            path: 'hotel/guests',
            element: (
              <PermissionGuard code="HOTEL_GUEST_READALL">
                <HotelGuestsPage />
              </PermissionGuard>
            ),
          },

          {
            path: 'hotel/guests/:guestId',
            element: <GuestDetailsPage />,
          },

          {
            path: 'hotel/reservations',
            element: (
              <PermissionGuard code="BOOKING_READALL">
                <HotelReservationsPage />
              </PermissionGuard>
            ),
          },

          {
            path: 'hotel/check-in',
            element: (
              <PermissionGuard code="BOOKING_CREATE_CHECK_IN">
                <HotelCheckInPage />
              </PermissionGuard>
            ),
          },

          /* Hotel-prefixed Restaurant Routes */
          {
            path: 'hotel/restaurant/pos',
            element: <RestaurantPOSPage />,
          },

          {
            path: 'hotel/restaurant/orders',
            element: <RestaurantOrdersPage />,
          },

          {
            path: 'hotel/restaurant/menu',
            element: <RestaurantMenuPage />,
          },

          {
            path: 'hotel/restaurant/kds',
            element: <RestaurantKDSPage />,
          },

          {
            path: 'hotel/restaurant/tables',
            element: <RestaurantTablesPage />,
          },

          /* Hotel-prefixed Inventory Routes */
          {
            path: 'hotel/inventory/products',
            element: <InventoryProductsPage />,
          },

          {
            path: 'hotel/inventory/stock',
            element: <InventoryStockPage />,
          },

          /* Hotel-prefixed Customers Routes */
          {
            path: 'hotel/customers/directory',
            element: <CustomersDirectoryPage />,
          },

          /* Hotel-prefixed Billing Routes */
          {
            path: 'hotel/billing/invoices',
            element: (
              <PermissionGuard code="INVOICE_READALL">
                <BillingInvoicesPage />
              </PermissionGuard>
            ),
          },

          /* Hotel-prefixed Staff Routes */
          {
            path: 'hotel/staff/attendance',
            element: <StaffAttendancePage />,
          },

          {
            path: 'hotel/staff/housekeeping',
            element: <HousekeepingPage />,
          },

          {
            path: 'hotel/restaurant/analytics',
            element: <RestaurantAnalyticsPage />,
          },

          {
            path: 'hotel/inventory/suppliers',
            element: <InventorySuppliersPage />,
          },

          {
            path: 'hotel/inventory/purchase-orders',
            element: <InventoryPurchaseOrdersPage />,
          },

          {
            path: 'hotel/customers/loyalty',
            element: <CustomersLoyaltyPage />,
          },

          {
            path: 'hotel/billing/payments',
            element: (
              <PermissionGuard code="PAYMENT_READALL">
                <BillingPaymentsPage />
              </PermissionGuard>
            ),
          },

          {
            path: 'hotel/billing/reports',
            element: <BillingReportsPage />,
          },

          {
            path: 'hotel/staff/salary',
            element: <StaffSalaryPage />,
          },

          {
            path: 'hotel/staff/advances',
            element: <StaffAdvancesPage />,
          },

          {
            path: 'hotel/finance/monthly-salary',
            element: <MonthlySalaryPage />,
          },

          {
            path: 'hotel/finance/cash-register',
            element: <CashRegisterPage />,
          },

          {
            path: 'hotel/maintenance',
            element: <MaintenanceDashboardPage />,
          },
        ],
      },

      /* =========================
         RESTAURANT (LEGACY REDIRECTS)
         ========================= */

      {
        path: 'restaurant/pos',
        element: (
          <Navigate
            to="/hotel/restaurant/pos"
            replace
          />
        ),
      },

      {
        path: 'restaurant/orders',
        element: (
          <Navigate
            to="/hotel/restaurant/orders"
            replace
          />
        ),
      },

      {
        path: 'restaurant/menu',
        element: (
          <Navigate
            to="/hotel/restaurant/menu"
            replace
          />
        ),
      },

      {
        path: 'restaurant/security',
        element: <RestaurantSecurityPage />,
      },

      {
        path: 'restaurant/kds',
        element: (
          <Navigate
            to="/hotel/restaurant/kds"
            replace
          />
        ),
      },

      {
        path: 'restaurant/tables',
        element: (
          <Navigate
            to="/hotel/restaurant/tables"
            replace
          />
        ),
      },

      {
        path: 'restaurant/analytics',
        element: (
          <Navigate
            to="/hotel/restaurant/analytics"
            replace
          />
        ),
      },

      /* =========================
         INVENTORY & SUPPLY (LEGACY REDIRECTS)
         ========================= */

      {
        path: 'inventory/products',
        element: (
          <Navigate
            to="/hotel/inventory/products"
            replace
          />
        ),
      },

      {
        path: 'inventory/stock',
        element: (
          <Navigate
            to="/hotel/inventory/stock"
            replace
          />
        ),
      },

      {
        path: 'inventory/suppliers',
        element: (
          <Navigate
            to="/hotel/inventory/suppliers"
            replace
          />
        ),
      },

      {
        path: 'inventory/purchase-orders',
        element: (
          <Navigate
            to="/hotel/inventory/purchase-orders"
            replace
          />
        ),
      },

      /* =========================
         CUSTOMERS (LEGACY REDIRECTS)
         ========================= */

      {
        path: 'customers/directory',
        element: (
          <Navigate
            to="/hotel/customers/directory"
            replace
          />
        ),
      },

      {
        path: 'customers/loyalty',
        element: (
          <Navigate
            to="/hotel/customers/loyalty"
            replace
          />
        ),
      },

      /* =========================
         BILLING (LEGACY REDIRECTS)
         ========================= */

      {
        path: 'billing/invoices',
        element: (
          <Navigate
            to="/hotel/billing/invoices"
            replace
          />
        ),
      },

      {
        path: 'billing/payments',
        element: (
          <Navigate
            to="/hotel/billing/payments"
            replace
          />
        ),
      },

      {
        path: 'billing/reports',
        element: (
          <Navigate
            to="/hotel/billing/reports"
            replace
          />
        ),
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
        path: 'admin/modules',
        element: <AdminModulesPage />,
      },

      {
        path: 'admin/sub-modules',
        element: <AdminSubModulesPage />,
      },

      {
        path: 'admin/module-permissions',
        element: <AdminModulePermissionsPage />,
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
        element: (
          <Navigate
            to="/hotel/finance/monthly-salary"
            replace
          />
        ),
      },

      {
        path: 'finance/cash-register',
        element: (
          <Navigate
            to="/hotel/finance/cash-register"
            replace
          />
        ),
      },

      /* =========================
         STAFF (LEGACY REDIRECTS)
         ========================= */

      {
        path: 'staff/salary',
        element: (
          <Navigate
            to="/hotel/staff/salary"
            replace
          />
        ),
      },

      {
        path: 'staff/attendance',
        element: (
          <Navigate
            to="/hotel/staff/attendance"
            replace
          />
        ),
      },

      {
        path: 'staff/advances',
        element: (
          <Navigate
            to="/hotel/staff/advances"
            replace
          />
        ),
      },

      {
        path: 'staff/housekeeping',
        element: (
          <Navigate
            to="/hotel/staff/housekeeping"
            replace
          />
        ),
      },

      /* =========================
         MAINTENANCE
         ========================= */

      {
        path: 'maintenance',
        element: (
          <Navigate
            to="/hotel/maintenance"
            replace
          />
        ),
      },

      {
        path: 'maintenance/dashboard',
        element: (
          <Navigate
            to="/hotel/maintenance"
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
            to="/hotel/staff/attendance"
            replace
          />
        ),
      },

      {
        path: 'staff/Attendence',
        element: (
          <Navigate
            to="/hotel/staff/attendance"
            replace
          />
        ),
      },

      {
        path: 'staff/Attendance',
        element: (
          <Navigate
            to="/hotel/staff/attendance"
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