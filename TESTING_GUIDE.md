# HMS Frontend-Backend API Integration Testing Guide

This guide explains how to start the HMS Node.js/Express backend server and test all 8 bound API modules from the frontend.

---

## 1. Prerequisites & Starting the Servers

### A. Start Backend Server
1. Open a terminal in the backend directory:
   ```bash
   cd "g:\DIPLOMA\SEMESTER 5\Internship\A_All projects during ITR\HMS BACKEND"
   npm install
   npm start
   ```
   *Verify the backend is running on `http://localhost:3000`.*

### B. Start Frontend Dev Server
1. Open a terminal in the frontend directory:
   ```bash
   cd "g:\DIPLOMA\SEMESTER 5\Internship\A_All projects during ITR\HMS FRONTEND"
   npm run dev
   ```
   *Open the app URL (e.g. `http://localhost:5173`) in your browser.*

---

## 2. Step-by-Step Module Testing Instructions

### 🔑 1. Auth Module (`/api/auth`)
* **Standard Login & OTP Flow**:
  1. Go to `/login`.
  2. Enter valid Email & Password $\rightarrow$ Click **Sign In**.
  3. The backend sends an OTP to your email and displays the **OTP Verification** screen.
  4. Enter the 6-digit OTP $\rightarrow$ Click **Verify OTP & Complete Login**.
  5. Upon success, you are logged in and redirected to the dashboard `/`.
* **Forgot Password Flow**:
  1. On the login screen, click **Forgot Password?**.
  2. Enter registered Email $\rightarrow$ Click **Send Reset OTP**.
  3. Enter the OTP and your New Password $\rightarrow$ Click **Reset Password**.
  4. Once reset, log in using the new password.

---

### 👤 2. User & Profile Change Password (`/api/user`)
* **Password Change in Profile**:
  1. Go to **Settings** (`/admin/settings`).
  2. Scroll down to the **Security & Password Change** section.
  3. Enter `Current Password`, `New Password`, and `Confirm New Password`.
  4. Click **Update Password** $\rightarrow$ Sends `PATCH /api/user/change-password`.
* **User Management**:
  1. Go to the Users / Staff section.
  2. Test user listing, user creation (`POST /api/user`), and status toggle (`PATCH /api/user/:id/status`).

---

### 🏢 3. Organization Module (`/api/organization`)
1. Go to Organization settings or registration modal.
2. Form submits data to `POST /api/organization` with `{ name, email, phone, organizationTypeId, address }`.
3. View listed organizations fetched from `GET /api/organization`.

---

### 🏬 4. Organization Branch Module (`/api/organization-branch`)
1. Test branch creation (`POST /api/organization-branch`) with `{ branchName, organizationId, cityId, stateId, countryId }`.
2. Fetch branches filtered by organization ID (`GET /api/organization-branch?organizationId=`).

---

### 💳 5. Subscription Plan Module (`/api/subscription-plan`)
1. Navigate to Subscription Plans (`/admin/subscription`).
2. List available active plans (`GET /api/subscription-plan?status=active`).
3. Toggle active plan status (`PATCH /api/subscription-plan/:id/status`).

---

### 🛡️ 6. Permission & Role-Permission Module (`/api/permission`, `/api/role-permission`)
1. Go to Roles & Permissions settings.
2. Load available permissions (`GET /api/permission`) and roles (`GET /api/role`).
3. Bulk update role permissions via `POST /api/role-permission/bulk-change` with `{ roleId, permissionIds: [...] }`.

---

### 🏙️ 7. City & Location Lookup Module (`/api/city`)
1. Open any branch or property address form.
2. Select a State $\rightarrow$ Triggers `GET /api/city?stateId=`.
3. Verify city dropdown populates dynamically from the backend database.

---

### 📁 8. Single File Upload (`/api/file/single`)
1. Upload a profile image or document avatar.
2. Triggers `POST /api/file/single` with `FormData` (`file`).
3. Verify uploaded file URL is returned and displayed in the preview.
