# Comprehensive Backend API & Frontend Binding Audit Report
**Project:** Hotel Management System (HMS) / SyncStays  
**Backend:** `C:\Projects\nex-one-backend`  
**Frontend:** `c:\Projects\Hotel Management System (HMS)\HMS_frontend`  
**Date:** September 4, 2026  
**Status:** Audit & Analysis Complete — Zero Project Source Code Modified  

---

## Executive Summary

An exhaustive, line-by-line inspection was conducted across the **Node.js/Express backend** (`C:\Projects\nex-one-backend`) and the **React Vite frontend** (`HMS_frontend`).

### High-Level Statistics
| Metric | Count | Details |
| :--- | :---: | :--- |
| **Total Backend API Endpoints** | **138** | Across 27 active Express route controllers |
| **Fully Bound Endpoints in UI** | **75** | Implemented in `src/services/` and actively invoked in pages/components |
| **Service Exists, but Never Called in UI** | **33** | Implemented in `src/services/`, but UI either ignores them, lacks UI, or uses dummy `localStorage` |
| **Missing From Frontend Services** | **21** | Backend has route & controller, but frontend service file omits the method |
| **Unimplemented Domain Services** | **9** | App Settings (5) & Org Subscriptions (4) have 0 frontend services |
| **Total Endpoints Remaining to Bind** | **63** | **45.6% of the backend API is currently unhooked / unbound** |
| **Frontend Mock/Dummy Data Locations** | **24+** | 3 dedicated mock files, 7 hooks with fallback mocks, 14+ UI pages with hardcoded data |
| **Frontend Modules with 0 Backend APIs** | **7 domains** | Restaurant (POS/KDS/Menu), Inventory, Customers CRM, Staff/Payroll, Maintenance, Notifications, Audit Logs |

---

## Section 1: Complete Backend API Master Matrix (138 Endpoints)

The table below catalogs every single endpoint available in `C:\Projects\nex-one-backend`, its corresponding frontend service mapping, and its exact UI binding status.

### Status Legend
- **BOUND**: Defined in a frontend service and actively called in real UI workflow.
- **SERVICE_ONLY**: Defined in a frontend service, but never called in any UI page or component.
- **MISSING_IN_SERVICE**: Backend route exists, but frontend service is missing this method.
- **UNIMPLEMENTED_DOMAIN**: Entire domain has no frontend service file.
- **DUMMY_BYPASS**: A frontend service or API exists, but the UI page uses mock data or browser `localStorage` instead.

---

### 1. Authentication (`/api/auth`) — 5 Endpoints
| HTTP Method | Path | Controller Handler | Frontend Service | UI Caller / Status | Details / Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | `login` | `authService.login` | `BOUND` | Called in `pages/Auth/Login/Index.jsx` |
| `POST` | `/api/auth/forgot-password` | `forgotPassword` | `authService.forgotPassword` | `BOUND` | Called inside `Auth/Login` modal. Note: Standalone `Auth/ForgotPassword/Index.jsx` is an unhooked static stub. |
| `POST` | `/api/auth/verify-otp` | `verifyOtp` | `authService.verifyOtp` | `BOUND` | Called in `pages/Auth/Login/Index.jsx` for 2FA and password reset OTP. |
| `POST` | `/api/auth/reset-password` | `resetPassword` | `authService.resetPassword` | `BOUND` | Called in `pages/Auth/Login/Index.jsx` modal. |
| `POST` | `/api/auth/logout` | `logout` | `authService.logout` | `SERVICE_ONLY / DUMMY_BYPASS` | **REMAINING TO BIND**. `AuthContext.jsx` (`logout`) clears localStorage locally and never invokes `authService.logout()`. |

---

### 2. Bookings & Folios (`/api/booking`) — 11 Endpoints
| HTTP Method | Path | Controller Handler | Frontend Service | UI Caller / Status | Details / Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/booking/availability` | `getRoomAvailability` | `bookingService.getAvailability` | `SERVICE_ONLY` | **REMAINING TO BIND**. Never called in UI. Front desk calendar & booking form do not check real-time availability endpoint. |
| `POST` | `/api/booking` | `addBooking` | `bookingService.create` | `BOUND` | Called in `UpcomingBookings.jsx` & `FutureBookingModal.jsx`. |
| `GET` | `/api/booking` | `getBookings` | `bookingService.getAll` | `BOUND` | Called in `useBookings.js` & `useInvoices.js`. (Fallback: `DEMO_BOOKINGS` used if empty/error). |
| `GET` | `/api/booking/:id` | `getBookingById` | `bookingService.getById` | `SERVICE_ONLY` | **REMAINING TO BIND**. UI relies on in-memory object from `getAll` instead of fetching fresh record by ID. |
| `PUT` | `/api/booking/:id` | `updateBooking` | `bookingService.update` | `BOUND` | Called in `useBookings.js` for modifications. |
| `POST` | `/api/booking/:id/check-in` | `checkIn` | `bookingService.checkIn` | `BOUND` | Called in `pages/Hotel/CheckIn/Index.jsx` and `UpcomingBookings.jsx`. |
| `POST` | `/api/booking/:id/check-out` | `checkOut` | `bookingService.checkOut` | `BOUND` | Called in `UpcomingBookings.jsx`. |
| `POST` | `/api/booking/:id/cancel` | `cancel` | `bookingService.cancel` | `BOUND` | Called in `UpcomingBookings.jsx`. |
| `GET` | `/api/booking/:id/folio` | `getFolio` | `bookingService.getFolio` | `BOUND` | Called in `BookingFolioModal.jsx`. |
| `POST` | `/api/booking/:id/folio/transaction` | `postFolioTransaction` | `bookingService.postFolioTransaction` | `BOUND` | Called in `BookingFolioModal.jsx` for posting charges/payments. |
| `POST` | `/api/booking/:id/folio/lock` | `lockFolioController` | `bookingService.lockFolio` | `BOUND` | Called in `BookingFolioModal.jsx`. |

---

### 3. User Management (`/api/user`) — 7 Endpoints
| HTTP Method | Path | Controller Handler | Frontend Service | UI Caller / Status | Details / Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/user` | `addUser` | `userService.create` | `BOUND` | Called via `registerUser()` in `pages/Auth/Register/Index.jsx`. |
| `GET` | `/api/user` | `getUser` | `userService.getAll` | `DUMMY_BYPASS` | **REMAINING TO BIND**. `pages/Admin/Users/Index.jsx` manages users in `localStorage.getItem('syncstays_users')` and never calls `userService.getAll()`! |
| `PATCH` | `/api/user/change-password` | `changePassword` | `userService.changePassword` | `BOUND` | Called in `pages/Admin/Settings/Index.jsx` (Change Password card). |
| `PATCH` | `/api/user/:id/status` | `updateUserStatus` | `userService.updateStatus` | `DUMMY_BYPASS` | **REMAINING TO BIND**. `Admin/Users` toggles status only in local state and `localStorage`. |
| `GET` | `/api/user/:id` | `getUserById` | `userService.getById` | `SERVICE_ONLY` | **REMAINING TO BIND**. Never called in UI. |
| `PUT` | `/api/user/:id` | `updateUser` | `userService.update` | `DUMMY_BYPASS` | **REMAINING TO BIND**. `Admin/Users` edit modal writes to `localStorage`. |
| `DELETE` | `/api/user/:id` | `deleteUser` | `userService.delete` | `DUMMY_BYPASS` | **REMAINING TO BIND**. `Admin/Users` delete modal writes to `localStorage`. |

---

### 4. Roles, Permissions & RBAC (`/api/role`, `/api/permission`, `/api/role-permission`) — 21 Endpoints
*Backend Note:* Two files mount to `/api/role-permission`: `role-permission.js` (6 routes) and `rolePermission.js` (5 routes).
| HTTP Method | Path | Controller Handler | Frontend Service | UI Caller / Status | Details / Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/role` | `addRole` | `None` | `MISSING_IN_SERVICE` | **REMAINING TO BIND**. `permissionService.js` lacks `createRole`. `Admin/RBAC` stores roles in `localStorage`. |
| `GET` | `/api/role` | `getRole` | `permissionService.getRoles` | `SERVICE_ONLY / DUMMY_BYPASS` | **REMAINING TO BIND**. `Admin/RBAC` ignores this and reads from `localStorage`. |
| `GET` | `/api/role/:id` | `getRoleById` | `None` | `MISSING_IN_SERVICE` | **REMAINING TO BIND**. |
| `PUT` | `/api/role/:id` | `updateRole` | `None` | `MISSING_IN_SERVICE` | **REMAINING TO BIND**. |
| `DELETE` | `/api/role/:id` | `deleteRole` | `None` | `MISSING_IN_SERVICE` | **REMAINING TO BIND**. |
| `POST` | `/api/permission` | `addPermission` | `None` | `MISSING_IN_SERVICE` | **REMAINING TO BIND**. |
| `GET` | `/api/permission` | `getPermission` | `permissionService.getPermissions` | `BOUND` | Called in `pages/Admin/ModulePermissions/Index.jsx`. |
| `GET` | `/api/permission/:id` | `getPermissionById` | `None` | `MISSING_IN_SERVICE` | **REMAINING TO BIND**. |
| `PUT` | `/api/permission/:id` | `updatePermission` | `None` | `MISSING_IN_SERVICE` | **REMAINING TO BIND**. |
| `DELETE` | `/api/permission/:id` | `deletePermission` | `None` | `MISSING_IN_SERVICE` | **REMAINING TO BIND**. |
| `POST` | `/api/role-permission` | `insertRolePermission` | `None` | `MISSING_IN_SERVICE` | **REMAINING TO BIND**. |
| `GET` | `/api/role-permission` | `retrieveRolePermission` | `permissionService.getRolePermissions` | `SERVICE_ONLY / DUMMY_BYPASS` | **REMAINING TO BIND**. Uncalled in `Admin/RBAC`. |
| `GET` | `/api/role-permission/:id` | `retrieveRolePermissionById` | `None` | `MISSING_IN_SERVICE` | **REMAINING TO BIND**. |
| `PUT` | `/api/role-permission/:id` | `modifyRolePermission` | `None` | `MISSING_IN_SERVICE` | **REMAINING TO BIND**. |
| `DELETE` | `/api/role-permission/:id` | `removeRolePermission` | `None` | `MISSING_IN_SERVICE` | **REMAINING TO BIND**. |
| `POST` | `/api/role-permission/bulk-change`| `alterRolePermissions` | `permissionService.bulkAssignRolePermissions`| `SERVICE_ONLY / DUMMY_BYPASS` | **REMAINING TO BIND**. `Admin/RBAC` uses dummy permission checkboxes. |
| `POST` | `/api/role-permission` (v2) | `addRolePermission` | `None` | `MISSING_IN_SERVICE` | Duplicate backend route file `rolePermission.js`. |
| `GET` | `/api/role-permission` (v2) | `getRolePermission` | `permissionService.getRolePermissions` | `SERVICE_ONLY` | Duplicate backend route. |
| `GET` | `/api/role-permission/:id` (v2)| `getRolePermissionById` | `None` | `MISSING_IN_SERVICE` | Duplicate backend route. |
| `PUT` | `/api/role-permission/:id` (v2)| `updateRolePermission` | `None` | `MISSING_IN_SERVICE` | Duplicate backend route. |
| `DELETE` | `/api/role-permission/:id` (v2)| `deleteRolePermission` | `None` | `MISSING_IN_SERVICE` | Duplicate backend route. |

---

### 5. Rooms (`/api/room`) — 6 Endpoints
| HTTP Method | Path | Controller Handler | Frontend Service | UI Caller / Status | Details / Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/room` | `addRoom` | `roomService.create` | `BOUND` | Called in `pages/Hotel/Rooms/Index.jsx`. |
| `POST` | `/api/room/bulk-delete` | `bulkDeleteRooms` | `None` | `MISSING_IN_SERVICE` | **REMAINING TO BIND**. `roomService.js` lacks `bulkDelete`. Rooms page deletes items one-by-one. |
| `GET` | `/api/room` | `getRooms` | `roomService.getAll` | `BOUND` | Called in `pages/Hotel/Rooms/Index.jsx`. |
| `GET` | `/api/room/:id` | `getRoomById` | `roomService.getById` | `BOUND` | Called in `pages/Hotel/Rooms/Index.jsx`. |
| `PUT` | `/api/room/:id` | `updateRoom` | `roomService.update` | `BOUND` | Called in `pages/Hotel/Rooms/Index.jsx`. |
| `DELETE` | `/api/room/:id` | `deleteRoom` | `roomService.delete` | `BOUND` | Called in `pages/Hotel/Rooms/Index.jsx`. |

---

### 6. Room Types (`/api/room-type`) — 5 Endpoints
| HTTP Method | Path | Controller Handler | Frontend Service | UI Caller / Status | Details / Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/room-type` | `addRoomType` | `roomTypeService.create` | `BOUND` | Called in `pages/Hotel/RoomTypes/Index.jsx`. |
| `GET` | `/api/room-type` | `getRoomTypes` | `roomTypeService.getAll` | `BOUND` | Called in `pages/Hotel/RoomTypes/Index.jsx` & `Hotel/Rooms/Index.jsx`. |
| `GET` | `/api/room-type/:id` | `getRoomTypeById` | `roomTypeService.getById` | `BOUND` | Called in `pages/Hotel/RoomTypes/Index.jsx`. |
| `PUT` | `/api/room-type/:id` | `updateRoomType` | `roomTypeService.update` | `BOUND` | Called in `pages/Hotel/RoomTypes/Index.jsx`. |
| `DELETE` | `/api/room-type/:id` | `deleteRoomType` | `roomTypeService.delete` | `BOUND` | Called in `pages/Hotel/RoomTypes/Index.jsx`. |

---

### 7. Amenities (`/api/amenity`) — 5 Endpoints
| HTTP Method | Path | Controller Handler | Frontend Service | UI Caller / Status | Details / Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/amenity` | `addAmenity` | `amenityService.create` | `BOUND` | Called in `pages/Hotel/Amenities/Index.jsx`. |
| `GET` | `/api/amenity` | `getAmenities` | `amenityService.getAll` | `BOUND` | Called in `pages/Hotel/Amenities/Index.jsx` & `Hotel/Rooms/Index.jsx`. |
| `GET` | `/api/amenity/:id` | `getAmenityById` | `amenityService.getById` | `BOUND` | Called in `pages/Hotel/Amenities/Index.jsx`. |
| `PUT` | `/api/amenity/:id` | `updateAmenity` | `amenityService.update` | `BOUND` | Called in `pages/Hotel/Amenities/Index.jsx`. |
| `DELETE` | `/api/amenity/:id` | `deleteAmenity` | `amenityService.delete` | `BOUND` | Called in `pages/Hotel/Amenities/Index.jsx`. |

---

### 8. Extra Services (`/api/extra-service-for-hotel`) — 5 Endpoints
| HTTP Method | Path | Controller Handler | Frontend Service | UI Caller / Status | Details / Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/extra-service-for-hotel` | `addExtraService` | `extraServiceService.create` | `BOUND` | Called in `pages/Hotel/ExtraServices/Index.jsx`. |
| `GET` | `/api/extra-service-for-hotel` | `getExtraServices` | `extraServiceService.getAll` | `BOUND` | Called in `pages/Hotel/ExtraServices/Index.jsx`. |
| `GET` | `/api/extra-service-for-hotel/:id` | `getExtraServiceById`| `extraServiceService.getById` | `BOUND` | Called in `pages/Hotel/ExtraServices/Index.jsx`. |
| `PUT` | `/api/extra-service-for-hotel/:id` | `updateExtraService` | `extraServiceService.update` | `BOUND` | Called in `pages/Hotel/ExtraServices/Index.jsx`. |
| `DELETE` | `/api/extra-service-for-hotel/:id`| `deleteExtraService` | `extraServiceService.delete` | `BOUND` | Called in `pages/Hotel/ExtraServices/Index.jsx`. |

---

### 9. Hotel Guests (`/api/hotel-guest`) — 5 Endpoints
| HTTP Method | Path | Controller Handler | Frontend Service | UI Caller / Status | Details / Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/hotel-guest` | `addHotelGuest` | `hotelGuestService.create` | `BOUND` | Called in `useHotelGuests.js` (`registerGuest`) & `UpcomingBookings.jsx`. |
| `GET` | `/api/hotel-guest` | `getHotelGuests` | `hotelGuestService.getAll` | `BOUND` | Called in `useHotelGuests.js` & `Hotel/Guests/Index.jsx`. |
| `GET` | `/api/hotel-guest/:id` | `getHotelGuestById` | `hotelGuestService.getById` | `BOUND` | Called in `pages/Hotel/Guests/Details/Index.jsx`. |
| `PUT` | `/api/hotel-guest/:id` | `updateHotelGuest` | `hotelGuestService.update` | `BOUND` | Called in `useHotelGuests.js` (`updateGuestStatus`). |
| `DELETE` | `/api/hotel-guest/:id` | `deleteHotelGuest` | `hotelGuestService.delete` | `SERVICE_ONLY` | **REMAINING TO BIND**. Never called in UI (guest deletion not implemented in table). |

---

### 10. Invoices (`/api/invoice`) — 6 Endpoints
| HTTP Method | Path | Controller Handler | Frontend Service | UI Caller / Status | Details / Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/invoice` | `addInvoice` | `invoiceService.create` | `BOUND` | Called in `InvoiceDrawer.jsx`. |
| `GET` | `/api/invoice` | `getInvoices` | `invoiceService.getAll` | `BOUND` | Called in `useInvoices.js` & `pages/Billing/Invoices/Index.jsx`. |
| `GET` | `/api/invoice/:id` | `getInvoiceById` | `invoiceService.getById` | `BOUND` | Called in `InvoiceDrawer.jsx`. |
| `GET` | `/api/invoice/:id/pdf` | `getInvoicePdf` | `invoiceService.getPdf / regeneratePdf` | `BOUND` | Called in `InvoiceDrawer.jsx`. |
| `PUT` | `/api/invoice/:id` | `updateInvoice` | `invoiceService.update` | `BOUND` | Called in `useInvoices.js` (`updateInvoiceStatus`). |
| `DELETE` | `/api/invoice/:id` | `deleteInvoice` | `invoiceService.delete` | `BOUND` | Called in `InvoiceDrawer.jsx`. |

---

### 11. Payments (`/api/payment`) — 5 Endpoints
| HTTP Method | Path | Controller Handler | Frontend Service | UI Caller / Status | Details / Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/payment` | `addPayment` | `paymentService.create` | `BOUND` | Called in `InvoiceDrawer.jsx`, `HotelCheckIn`, and `UpcomingBookings`. |
| `GET` | `/api/payment` | `getPayments` | `paymentService.getAll` | `BOUND` | Called in `usePayments.js` & `useInvoices.js`. |
| `GET` | `/api/payment/:id` | `getPaymentById` | `paymentService.getById` | `SERVICE_ONLY` | **REMAINING TO BIND**. Payment details modal uses in-memory row. |
| `PUT` | `/api/payment/:id` | `updatePayment` | `paymentService.update` | `BOUND` | Called in `usePayments.js` (`updatePaymentStatus` / refunds). |
| `DELETE` | `/api/payment/:id` | `deletePayment` | `paymentService.delete` | `BOUND` | Called in `usePayments.js` (`voidPayment`). |

---

### 12. Organization (`/api/organization`) — 5 Endpoints
| HTTP Method | Path | Controller Handler | Frontend Service | UI Caller / Status | Details / Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/organization` | `addOrganization` | `organizationService.create` | `SERVICE_ONLY` | **REMAINING TO BIND**. Only `registerUser` resolves org, but no admin UI creates orgs. |
| `GET` | `/api/organization` | `getOrganization` | `organizationService.getAll` | `BOUND` | Called in `pages/Auth/Register/Index.jsx` dropdown. |
| `GET` | `/api/organization/:id` | `getOrganizationById` | `organizationService.getById` | `SERVICE_ONLY` | **REMAINING TO BIND**. No Organization settings page exists. |
| `PUT` | `/api/organization/:id` | `updateOrganization` | `organizationService.update` | `SERVICE_ONLY` | **REMAINING TO BIND**. |
| `DELETE` | `/api/organization/:id` | `deleteOrganization` | `organizationService.delete` | `SERVICE_ONLY` | **REMAINING TO BIND**. |

---

### 13. Organization Branches (`/api/organization-branch`) — 5 Endpoints
| HTTP Method | Path | Controller Handler | Frontend Service | UI Caller / Status | Details / Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/organization-branch` | `addOrganizationBranch` | `branchService.create` | `SERVICE_ONLY` | **REMAINING TO BIND**. Modal form in `Admin/Branches` only writes to local state. |
| `GET` | `/api/organization-branch` | `getOrganizationBranch` | `branchService.getAll` | `BOUND` | Called in `pages/Admin/Branches/Index.jsx`. |
| `GET` | `/api/organization-branch/:id` | `getOrganizationBranchById` | `branchService.getById` | `SERVICE_ONLY` | **REMAINING TO BIND**. |
| `PUT` | `/api/organization-branch/:id` | `updateOrganizationBranch` | `branchService.update` | `SERVICE_ONLY` | **REMAINING TO BIND**. |
| `DELETE` | `/api/organization-branch/:id` | `deleteOrganizationBranch` | `branchService.delete` | `BOUND` | Called in `pages/Admin/Branches/Index.jsx`. |

---

### 14. Organization Type (`/api/organization-type`) — 5 Endpoints
| HTTP Method | Path | Controller Handler | Frontend Service | UI Caller / Status | Details / Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/organization-type` | `addOrganizationType` | `orgTypeService.create` | `BOUND` | Called in `pages/Admin/Settings/Index.jsx`. |
| `GET` | `/api/organization-type` | `getOrganizationType` | `orgTypeService.getAll` | `BOUND` | Called in `pages/Admin/Settings/Index.jsx`. |
| `GET` | `/api/organization-type/:id` | `getOrganizationTypeById` | `None` | `MISSING_IN_SERVICE` | **REMAINING TO BIND**. |
| `PUT` | `/api/organization-type/:id` | `updateOrganizationType` | `orgTypeService.update` | `SERVICE_ONLY` | **REMAINING TO BIND**. |
| `DELETE` | `/api/organization-type/:id` | `deleteOrganizationType` | `orgTypeService.delete` | `BOUND` | Called in `pages/Admin/Settings/Index.jsx`. |

---

### 15. Modules & Sub-Modules (`/api/module`, `/api/sub-module`, `/api/module-permission`) — 15 Endpoints
| HTTP Method | Path | Controller Handler | Frontend Service | UI Caller / Status | Details / Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/module` | `addModule` | `moduleService.create` | `BOUND` | Called in `pages/Admin/Modules/Index.jsx`. |
| `GET` | `/api/module` | `getModule` | `moduleService.getAll` | `BOUND` | Called in `pages/Admin/Modules/Index.jsx` & `ModulePermissions`. |
| `GET` | `/api/module/:id` | `getModuleById` | `moduleService.getById` | `SERVICE_ONLY` | **REMAINING TO BIND**. |
| `PUT` | `/api/module/:id` | `updateModule` | `moduleService.update` | `BOUND` | Called in `pages/Admin/Modules/Index.jsx`. |
| `DELETE` | `/api/module/:id` | `deleteModule` | `moduleService.delete` | `BOUND` | Called in `pages/Admin/Modules/Index.jsx`. |
| `POST` | `/api/sub-module` | `addSubModule` | `subModuleService.create` | `BOUND` | Called in `pages/Admin/SubModules/Index.jsx`. |
| `GET` | `/api/sub-module` | `getSubModule` | `subModuleService.getAll` | `BOUND` | Called in `pages/Admin/SubModules/Index.jsx` & `ModulePermissions`. |
| `GET` | `/api/sub-module/:id` | `getSubModuleById` | `subModuleService.getById` | `SERVICE_ONLY` | **REMAINING TO BIND**. |
| `PUT` | `/api/sub-module/:id` | `updateSubModule` | `subModuleService.update` | `BOUND` | Called in `pages/Admin/SubModules/Index.jsx`. |
| `DELETE` | `/api/sub-module/:id` | `deleteSubModule` | `subModuleService.delete` | `BOUND` | Called in `pages/Admin/SubModules/Index.jsx`. |
| `POST` | `/api/module-permission` | `addModulePermission` | `modulePermissionService.create` | `BOUND` | Called in `pages/Admin/ModulePermissions/Index.jsx`. |
| `GET` | `/api/module-permission` | `getModulePermission` | `modulePermissionService.getAll` | `BOUND` | Called in `pages/Admin/ModulePermissions/Index.jsx`. |
| `GET` | `/api/module-permission/:id` | `getModulePermissionById` | `modulePermissionService.getById` | `SERVICE_ONLY` | **REMAINING TO BIND**. |
| `PUT` | `/api/module-permission/:id` | `updateModulePermission` | `modulePermissionService.update` | `BOUND` | Called in `pages/Admin/ModulePermissions/Index.jsx`. |
| `DELETE` | `/api/module-permission/:id` | `deleteModulePermission` | `modulePermissionService.delete` | `BOUND` | Called in `pages/Admin/ModulePermissions/Index.jsx`. |

---

### 16. Subscription Plans (`/api/subscription-plan`) — 8 Endpoints
| HTTP Method | Path | Controller Handler | Frontend Service | UI Caller / Status | Details / Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/subscription-plan` | `addSubscriptionPlan` | `subscriptionService.create` | `BOUND` | Called in `pages/Admin/Subscription/Index.jsx`. |
| `GET` | `/api/subscription-plan` | `getSubscriptionPlan` | `subscriptionService.getAll` | `BOUND` | Called in `pages/Admin/Subscription/Index.jsx`. |
| `GET` | `/api/subscription-plan/:id` | `getSubscriptionPlanById`| `subscriptionService.getById` | `SERVICE_ONLY` | **REMAINING TO BIND**. |
| `PUT` | `/api/subscription-plan/:id` | `updateSubscriptionPlan` | `subscriptionService.update` | `BOUND` | Called in `pages/Admin/Subscription/Index.jsx`. |
| `DELETE` | `/api/subscription-plan/:id` | `deleteSubscriptionPlan` | `subscriptionService.delete` | `BOUND` | Called in `pages/Admin/Subscription/Index.jsx`. |
| `PATCH` | `/api/subscription-plan/:id/module` | `updatePlanModule` | `subscriptionService.assignModules` | `SERVICE_ONLY` | **REMAINING TO BIND**. Module assignment modal unhooked. |
| `PATCH` | `/api/subscription-plan/:id/resource-limit` | `updatePlanResourceLimit` | `subscriptionService.setResourceLimits` | `SERVICE_ONLY` | **REMAINING TO BIND**. Limits modal unhooked. |
| `PATCH` | `/api/subscription-plan/:id/status` | `updatePlanStatus` | `subscriptionService.updateStatus` | `BOUND` | Called in `pages/Admin/Subscription/Index.jsx` toggle. |

---

### 17. Organization Subscriptions (`/api/organization-subscription`) — 4 Endpoints
| HTTP Method | Path | Controller Handler | Frontend Service | UI Caller / Status | Details / Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/organization-subscription` | `addOrganizationSubscription` | `None` | `UNIMPLEMENTED_DOMAIN` | **REMAINING TO BIND**. Zero frontend service or UI. |
| `GET` | `/api/organization-subscription` | `getOrganizationSubscription` | `None` | `UNIMPLEMENTED_DOMAIN` | **REMAINING TO BIND**. Zero frontend service or UI. |
| `GET` | `/api/organization-subscription/:id` | `getOrganizationSubscriptionById` | `None` | `UNIMPLEMENTED_DOMAIN` | **REMAINING TO BIND**. Zero frontend service or UI. |
| `PUT` | `/api/organization-subscription/:id` | `updateOrganizationSubscription` | `None` | `UNIMPLEMENTED_DOMAIN` | **REMAINING TO BIND**. Zero frontend service or UI. |

---

### 18. App Settings (`/api/app-settings`) — 5 Endpoints
| HTTP Method | Path | Controller Handler | Frontend Service | UI Caller / Status | Details / Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/app-settings` | `addAppSettings` | `None` | `UNIMPLEMENTED_DOMAIN` | **REMAINING TO BIND**. No `appSettingsService` exists. `Settings/BillingInvoices` saves to `localStorage`. |
| `GET` | `/api/app-settings` | `getAppSettings` | `None` | `UNIMPLEMENTED_DOMAIN` | **REMAINING TO BIND**. No frontend service. |
| `GET` | `/api/app-settings/:id` | `getAppSettingsById` | `None` | `UNIMPLEMENTED_DOMAIN` | **REMAINING TO BIND**. No frontend service. |
| `PUT` | `/api/app-settings/:id` | `updateAppSettings` | `None` | `UNIMPLEMENTED_DOMAIN` | **REMAINING TO BIND**. No frontend service. |
| `DELETE` | `/api/app-settings/:id` | `deleteAppSettings` | `None` | `UNIMPLEMENTED_DOMAIN` | **REMAINING TO BIND**. No frontend service. |

---

### 19. File Uploads (`/api/file`) — 2 Endpoints
| HTTP Method | Path | Controller Handler | Frontend Service | UI Caller / Status | Details / Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/file` | `insertFile` | `None` | `MISSING_IN_SERVICE` | **REMAINING TO BIND**. Batch upload route unmapped. |
| `POST` | `/api/file/single` | `insertsingleFile` | `fileService.uploadSingle` | `SERVICE_ONLY` | **REMAINING TO BIND**. Defined in `fileService.js` but NEVER called anywhere in frontend UI. Room pictures and guest ID proofs are purely fake/local strings. |

---

### 20. Geography & Lookups (`/api/city`, `/api/state`, `/api/country`, `/api/currency`) — 8 Endpoints
| HTTP Method | Path | Controller Handler | Frontend Service | UI Caller / Status | Details / Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/currency` | `getCurrency` | `lookupService.getCurrencies` | `BOUND` | Called in `pages/Admin/Settings/Index.jsx`. |
| `PUT` | `/api/currency` | `updateCurrency` | `lookupService.updateCurrency` | `SERVICE_ONLY` | **REMAINING TO BIND**. Never called in UI. |
| `GET` | `/api/country` | `getCountry` | `lookupService.getCountries` | `BOUND` | Called in `pages/Admin/Branches/Index.jsx`. |
| `PUT` | `/api/country` | `updateCountry` | `lookupService.updateCountry` | `SERVICE_ONLY` | **REMAINING TO BIND**. Never called in UI. |
| `GET` | `/api/state` | `getState` | `lookupService.getStates` | `SERVICE_ONLY` | **REMAINING TO BIND**. Never called in UI dropdowns. |
| `PUT` | `/api/state` | `updateState` | `None` | `MISSING_IN_SERVICE` | **REMAINING TO BIND**. |
| `GET` | `/api/city` | `getCity` | `lookupService.getCities` | `SERVICE_ONLY` | **REMAINING TO BIND**. Never called in UI dropdowns. |
| `PUT` | `/api/city` | `updateCity` | `None` | `MISSING_IN_SERVICE` | **REMAINING TO BIND**. |

---

## Section 2: Summary of Everything Remaining to Bind (63 Endpoints)

The 63 remaining items fall into 4 distinct architectural groups:

### Category A: Endpoints with Service Methods Ready, but UI Doesn't Call Them (33 Endpoints)
1. `POST /api/auth/logout` — `AuthContext.logout()` clears local storage and token, but does not invoke backend logout.
2. `GET /api/booking/availability` — Room availability check not hooked to date pickers.
3. `GET /api/booking/:id` — Detail view relies on parent list cache.
4. `GET /api/user` — `AdminUsersPage` does not call `userService.getAll()`.
5. `PATCH /api/user/:id/status` — `AdminUsersPage` does not call `userService.updateStatus()`.
6. `GET /api/user/:id` — User profile drawer unhooked.
7. `PUT /api/user/:id` — User edit modal unhooked.
8. `DELETE /api/user/:id` — User deletion unhooked.
9. `GET /api/role` — `AdminRBACPage` does not call `permissionService.getRoles()`.
10. `GET /api/role-permission` — `AdminRBACPage` does not call `permissionService.getRolePermissions()`.
11. `POST /api/role-permission/bulk-change` — `AdminRBACPage` permission saving is local only.
12. `POST /api/organization` — Organization creation modal unhooked.
13. `GET /api/organization/:id` — Org details view unhooked.
14. `PUT /api/organization/:id` — Org edit unhooked.
15. `DELETE /api/organization/:id` — Org delete unhooked.
16. `POST /api/organization-branch` — Branch creation form unhooked from API.
17. `GET /api/organization-branch/:id` — Branch details unhooked.
18. `PUT /api/organization-branch/:id` — Branch edit unhooked.
19. `PUT /api/organization-type/:id` — Org type edit unhooked.
20. `GET /api/payment/:id` — Payment ledger detail drawer unhooked.
21. `DELETE /api/hotel-guest/:id` — Guest record deletion unhooked.
22. `POST /api/file/single` — Image/document file upload unhooked in all forms.
23. `GET /api/city` — City dropdown unhooked.
24. `GET /api/state` — State dropdown unhooked.
25. `PUT /api/country` — Country configuration unhooked.
26. `PUT /api/currency` — Currency exchange/symbol configuration unhooked.
27. `GET /api/module/:id` — Module detail unhooked.
28. `GET /api/sub-module/:id` — Sub-module detail unhooked.
29. `GET /api/module-permission/:id` — Module permission detail unhooked.
30. `GET /api/subscription-plan/:id` — Subscription plan detail unhooked.
31. `PATCH /api/subscription-plan/:id/module` — Subscription plan module attachment modal unhooked.
32. `PATCH /api/subscription-plan/:id/resource-limit` — Subscription plan resource limits modal unhooked.
33. `GET /api/role-permission` (v2 duplicate) — Unused duplicate endpoint.

### Category B: Endpoints Missing from Frontend Service Files (21 Endpoints)
1. `POST /api/room/bulk-delete` — Missing in `roomService.js`.
2. `POST /api/file` — Multi-file upload missing in `fileService.js`.
3. `GET /api/organization-type/:id` — Missing in `orgTypeService.js`.
4. `PUT /api/city` — Missing in `lookupService.js`.
5. `PUT /api/state` — Missing in `lookupService.js`.
6. `POST /api/permission` — Missing in `permissionService.js`.
7. `GET /api/permission/:id` — Missing in `permissionService.js`.
8. `PUT /api/permission/:id` — Missing in `permissionService.js`.
9. `DELETE /api/permission/:id` — Missing in `permissionService.js`.
10. `POST /api/role` — Missing in `permissionService.js`.
11. `GET /api/role/:id` — Missing in `permissionService.js`.
12. `PUT /api/role/:id` — Missing in `permissionService.js`.
13. `DELETE /api/role/:id` — Missing in `permissionService.js`.
14. `POST /api/role-permission` — Missing in `permissionService.js`.
15. `GET /api/role-permission/:id` — Missing in `permissionService.js`.
16. `PUT /api/role-permission/:id` — Missing in `permissionService.js`.
17. `DELETE /api/role-permission/:id` — Missing in `permissionService.js`.
18. `POST /api/role-permission` (v2) — Missing in `permissionService.js`.
19. `GET /api/role-permission/:id` (v2) — Missing in `permissionService.js`.
20. `PUT /api/role-permission/:id` (v2) — Missing in `permissionService.js`.
21. `DELETE /api/role-permission/:id` (v2) — Missing in `permissionService.js`.

### Category C: Unimplemented Backend Domains (9 Endpoints)
1. `POST /api/app-settings` — No `appSettingsService.js` exists.
2. `GET /api/app-settings` — No `appSettingsService.js` exists.
3. `GET /api/app-settings/:id` — No `appSettingsService.js` exists.
4. `PUT /api/app-settings/:id` — No `appSettingsService.js` exists.
5. `DELETE /api/app-settings/:id` — No `appSettingsService.js` exists.
6. `POST /api/organization-subscription` — No `orgSubscriptionService.js` exists.
7. `GET /api/organization-subscription` — No `orgSubscriptionService.js` exists.
8. `GET /api/organization-subscription/:id` — No `orgSubscriptionService.js` exists.
9. `PUT /api/organization-subscription/:id` — No `orgSubscriptionService.js` exists.

---

## Section 3: Exhaustive Frontend Dummy / Mock Data Audit

Every location in the frontend codebase where mock data, hardcoded fixtures, or `localStorage` simulated persistence is used is detailed below:

### 1. Dedicated Mock Data Files
| File Path | Mock Data Variables | Description |
| :--- | :--- | :--- |
| `src/pages/Inventory/mockData.js` | `mockProducts`, `mockCategories`, `mockBrands`, `mockProductTypes`, `mockUnits`, `mockSuppliers`, `mockPurchaseOrders` | Complete offline catalog containing products, categories, suppliers, and purchase orders. |
| `src/pages/Restaurant/POS/mockPosData.js` | `INITIAL_TABLES`, `MENU_CATEGORIES`, `MENU_ITEMS` | Mock POS tables (1-12), menu categories, and dishes with price & modifier items. |
| `src/pages/Restaurant/KDS/mockKdsData.js` | `KDS_STATIONS`, `INITIAL_KITCHEN_ORDERS` | Mock kitchen tickets (#K-101 to #K-103) with station assignments and timers. |
| `src/data/guestData.json` | 4 JSON records (`g-0001` to `g-0004`) | Static mock guest dataset (orphaned legacy file). |

### 2. Custom Hooks with Embedded Dummy Data / Fallbacks
| Hook File Path | Dummy Variable / Mechanism | Purpose / Impact |
| :--- | :--- | :--- |
| `src/hooks/useBookings.js` | `DEMO_BOOKINGS` (5 bookings) | Line 229: `setBookings(normalized.length > 0 ? normalized : DEMO_BOOKINGS)`. If the backend DB is empty or fails, it displays Eleanor Shellstrop, Marcus Aurelius, etc. instead of an empty state. |
| `src/hooks/useHotelGuests.js` | `syncstays_guest_status_overrides` | Saves status overrides in browser `localStorage` to mask backend update issues. |
| `src/hooks/useCustomers.js` | `INITIAL_CUSTOMERS` (5 customers) | Mock CRM dataset: Ayesha Khan, Rajesh Mehta, David Kim, Priya Patel, Michael Chang. |
| `src/hooks/useCustomerLoyalty.js` | `INITIAL_TRANSACTIONS` | Mock loyalty ledger transactions: lt-9005, lt-9004, etc. |
| `src/hooks/useCustomerHistory.js` | `DUMMY_STAYS` | Mock historical guest stay records: RES-5001, RES-5002. |
| `src/hooks/useRestaurantMenu.js` | `DEFAULT_MENU_ITEMS` (8 items) | Mock menu catalog (Paneer Tikka, Butter Chicken, Dal Makhani, etc.). |
| `src/hooks/useRestaurantOrders.js` | `INITIAL_ORDERS` (6 orders) | Mock live orders queue (#4402 through #4407). |
| `src/hooks/useRestaurantTables.js` | `INITIAL_TABLES` (8 tables) | Mock table layout (Dining Hall, Garden Terrace, VIP Lounge). |
| `src/hooks/useRestaurantAnalytics.js` | `INITIAL_TRANSACTIONS` | Mock analytics revenue and order volume charts. |
| `src/hooks/useInvoices.js` | `#INV-${bookingRef}` synthesis | Generates artificial in-memory invoice models from bookings if real invoices are missing. |

### 3. Pages & Components with Hardcoded Dummy State & LocalStorage Bypasses
| Component / Page File | Dummy State / Mechanism | Root Cause |
| :--- | :--- | :--- |
| `src/pages/Dashboard/Index.jsx` | `const KPI_DATA = [...]` | Hardcoded metrics: Vacant 42, Occupied 158, Checkout Today 24. No live calculation from `roomService` or `bookingService`. |
| `src/pages/Analytics/Index.jsx` | `const employees = [...]`, `const monthlyTotals = [...]` | Displays static yearly salary figures for Elena Rodriguez, Marcus Chen, etc. |
| `src/pages/Billing/Reports/Index.jsx` | `const INITIAL_TRANSACTIONS = [...]` | 10 static billing transactions (tx-100 to tx-109) exported to CSV. |
| `src/pages/Admin/Users/Index.jsx` | `localStorage.getItem('syncstays_users')` | **Major Bypass:** CRUD operations mutate browser `localStorage` instead of calling `userService`. |
| `src/pages/Admin/RBAC/Index.jsx` | `localStorage.getItem('syncstays_roles')` & `const permissionGroups = [...]` | **Major Bypass:** Roles and permissions are stored only in `localStorage` instead of calling `permissionService` and `/api/role-permission`. |
| `src/pages/Admin/Settings/Index.jsx` | `const INITIAL_ROOMS = [...]` & `localStorage.getItem('syncstays_admin_settings')` | Hardcoded room-type mappings (30 rooms) and fallback currency list. |
| `src/pages/Settings/BillingInvoices/Index.jsx`| `localStorage.getItem('billingSettings')` & `defaultFormData` | Form saves to `localStorage` instead of backend `/api/app-settings`. |
| `src/pages/Admin/Subscription/Index.jsx` | Basic ($49), Professional ($149), Enterprise ($299) | Fallback hardcoded subscription plans rendered when backend DB table is empty. |
| `src/pages/Staff/Attendance/Index.jsx` | `INITIAL_ATTENDANCE` | Hardcoded staff check-ins (Rajesh Kumar, Sunita Rao, etc.). Backend has NO attendance API. |
| `src/pages/Staff/Salary/Index.jsx` | Hardcoded salary table | Hardcoded payroll ledger. Backend has NO salary API. |
| `src/pages/Staff/Advances/Index.jsx` | Hardcoded advances table | Hardcoded salary advances. Backend has NO advances API. |
| `src/pages/Staff/Housekeeping/Index.jsx` | Hardcoded cleaning assignments | Hardcoded room cleaning tasks. Backend has NO housekeeping API. |
| `src/pages/Finance/MonthlySalary/Index.jsx` | Hardcoded salary payouts | Hardcoded financial payroll ledger. |
| `src/pages/Finance/CashRegister/Index.jsx` | Hardcoded cash drawer records | Hardcoded cash in/out float. |
| `src/pages/Maintenance/Index.jsx` | Hardcoded work orders | Hardcoded repair tickets. Backend has NO maintenance API. |
| `src/pages/AuditLogs/Index.jsx` | `[ Immutable Audit Log Table & Diff Viewer Stub ]` | UI stub without implementation. Backend has NO audit route. |
| `src/pages/Reservations/Index.jsx` | `[ Screen Stub — Figma Frame ]` | Abandoned duplicate screen stub (superseded by `Hotel/Reservations`). |
| `src/pages/Rooms/Index.jsx` | `[ Room 101 Stub - Single King ]` | Abandoned duplicate screen stub (superseded by `Hotel/Rooms`). |

---

## Section 4: Frontend Modules with Zero Backend APIs Implemented

The following 7 frontend domains have rich user interfaces, but **their backend endpoints do not exist in `C:\Projects\nex-one-backend\src\routes`**. While some of these are modeled in `schema.sql` and `backendMD/`, no Express routes, controllers, or services are coded in the backend:

1. **Restaurant POS, Kitchen & Orders**
   - *Pages:* `/hotel/restaurant/pos`, `/hotel/restaurant/orders`, `/hotel/restaurant/kds`, `/hotel/restaurant/tables`, `/hotel/restaurant/menu`, `/hotel/restaurant/analytics`
   - *Schema Tables Defined:* `restaurantSection`, `restaurantTable`, `tableQrCode`, `menu`, `menuItem`, `menuItemPrice`, `order`, `orderItem`, `kitchenOrder`, `kitchenOrderItem`
   - *Backend Route Status:* **0 routes implemented in `src/routes/`**.
2. **Inventory & Purchasing**
   - *Pages:* `/hotel/inventory/products`, `/hotel/inventory/stock`, `/hotel/inventory/suppliers`, `/hotel/inventory/purchase-orders`
   - *Schema Tables Defined:* `category`, `brand`, `unit`, `productType`, `product`, `productUnit`, `supplier`, `batch`, `stock`, `stockTransaction`, `purchase`, `purchaseItem`, `purchaseInvoice`
   - *Backend Route Status:* **0 routes implemented in `src/routes/`**.
3. **Customer CRM & Loyalty**
   - *Pages:* `/hotel/customers/directory`, `/hotel/customers/loyalty`
   - *Schema Tables Defined:* `customer`
   - *Backend Route Status:* **0 routes implemented in `src/routes/`**.
4. **Staff Management & Payroll**
   - *Pages:* `/hotel/staff/attendance`, `/hotel/staff/salary`, `/hotel/staff/advances`, `/hotel/staff/housekeeping`, `/hotel/finance/monthly-salary`, `/hotel/finance/cash-register`
   - *Schema Tables Defined:* None.
   - *Backend Route Status:* **0 routes implemented in `src/routes/`**.
5. **Maintenance & Facilities**
   - *Pages:* `/hotel/maintenance`
   - *Schema Tables Defined:* None.
   - *Backend Route Status:* **0 routes implemented in `src/routes/`**.
6. **Notifications System**
   - *Pages & Hooks:* `/notifications`, `useNotifications.js` (calls `/notifications?page=1...`)
   - *Schema Tables Defined:* `notification`
   - *Backend Route Status:* **0 routes implemented in `src/routes/`** (Frontend call results in 404).
7. **System Audit Logs**
   - *Pages:* `/audit-logs`
   - *Schema Tables Defined:* `auditLog`, `errorLogger`
   - *Backend Route Status:* **0 routes implemented in `src/routes/`**.

---

## Section 5: Backend Gotchas & Architectural Defects

During the inspection of `C:\Projects\nex-one-backend`, the following critical issues were identified:

1. **Duplicate Role-Permission Route Files:**
   - Both `src/routes/role-permission.js` and `src/routes/rolePermission.js` exist in backend `src/routes/`.
   - In Express dynamic loader (`src/routes/index.js`), `kebabCase('role-permission')` and `kebabCase('rolePermission')` both resolve to `/api/role-permission`.
   - `role-permission.js` defines `/bulk-change` and uses `alterRolePermissions`, whereas `rolePermission.js` does not. Because both are loaded into the same route prefix, one partially masks the other!
2. **Missing Frontend Service for App Settings:**
   - Backend has 5 complete CRUD endpoints for `/api/app-settings`, but frontend has NO `appSettingsService.js`.
3. **Missing Frontend Service for Organization Subscriptions:**
   - Backend has 4 endpoints for `/api/organization-subscription`, but frontend has NO service for it.
4. **Room Bulk-Delete Not Exposed:**
   - Backend has `POST /api/room/bulk-delete`, but `roomService.js` lacks this method.
5. **File Upload Never Used by UI:**
   - Backend has file upload endpoints (`/api/file/single` using multer), but frontend forms (Room images, guest ID proofs) don't upload files; they only submit plain text strings.
6. **Auth Logout Not Invalidating Session:**
   - `AuthContext.jsx` clears browser storage without calling `POST /api/auth/logout`. Backend session logs are never updated on user sign out.

---

## Section 6: Actionable Implementation Roadmap

To achieve 100% integration between the frontend and the existing backend, follow this priority sequence:

### Phase 1: Connect High-Impact Admin Modules to Existing APIs
- [ ] **Admin Users (`src/pages/Admin/Users/Index.jsx`):** Replace `localStorage` with `userService.getAll()`, `create()`, `update()`, `updateStatus()`, and `delete()`.
- [ ] **Admin RBAC (`src/pages/Admin/RBAC/Index.jsx`):** Remove hardcoded `permissionGroups` and `syncstays_roles`. Bind to `permissionService.getRoles()`, `getPermissions()`, and `bulkAssignRolePermissions()`.
- [ ] **App Settings (`src/pages/Settings/BillingInvoices` & `Admin/Settings`):** Create `appSettingsService.js` and bind `/api/app-settings` to load and persist hotel invoice header, address, tax rate, and branding.

### Phase 2: Complete Service Methods & UI Bindings
- [ ] **Booking Availability:** Bind `bookingService.getAvailability()` to date range pickers and new reservation form.
- [ ] **File Upload:** Hook `fileService.uploadSingle` to room image inputs and guest document upload buttons.
- [ ] **Auth Logout:** Update `AuthContext.logout()` to call `authService.logout()` before clearing tokens.
- [ ] **Room Bulk-Delete:** Add `bulkDelete` to `roomService.js` and bind to room table multi-select actions.
- [ ] **Organization Subscriptions:** Create `orgSubscriptionService.js` and display active organization subscription details in `AdminSubscriptionPage`.

### Phase 3: Backend Cleanup
- [ ] Remove duplicate `src/routes/rolePermission.js` in backend; keep `role-permission.js` which supports `bulk-change`.
- [ ] Implement backend routes for `notification` table so `useNotifications.js` stops failing with 404.

---
*Report generated autonomously by Antigravity Agent. All project source files remain strictly untouched.*
