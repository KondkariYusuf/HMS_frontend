# 01 — Authentication & OTP

Handles user login, session lifecycle, password management, and OTP verification flows.

**Entities:** `user` (read for `me`), `userOtp`, token blacklist / `tokenVersion`.
**Base path:** `/api/v1/auth`
**Frontend module:** Login / Auth screens, Forgot-password flow, Account settings (change password).

---

## Endpoint Summary

| # | Action | Method | Path | Auth | Permission |
|---|--------|--------|------|------|------------|
| 1 | Login | POST | `/auth/login` | Public | — |
| 2 | Refresh token | POST | `/auth/refresh` | Public (refresh token) | — |
| 3 | Logout | POST | `/auth/logout` | Bearer | — |
| 4 | Logout all sessions | POST | `/auth/logout-all` | Bearer | — |
| 5 | Current user | GET | `/auth/me` | Bearer | — |
| 6 | Change password | POST | `/auth/change-password` | Bearer | — |
| 7 | Forgot password (request OTP) | POST | `/auth/forgot-password` | Public | — |
| 8 | Reset password (with OTP) | POST | `/auth/reset-password` | Public | — |
| 9 | Send OTP (email/phone verify) | POST | `/auth/send-otp` | Public/Bearer | — |
| 10 | Verify OTP | POST | `/auth/verify-otp` | Public/Bearer | — |
| 11 | Resend OTP | POST | `/auth/resend-otp` | Public | — |

---

## 1. Login

`POST /auth/login`  · **Public**

Authenticates a user by email/phone + password. If the org enforces 2FA, returns an `otpToken` instead of tokens.

### Request

```json
{
  "identifier": "manager@grandhotel.com",
  "password": "SecurePass@123"
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `identifier` | string | Yes | Email or phone number. |
| `password` | string | Yes | Plain text over HTTPS. |

### Response `200`

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 900,
    "user": {
      "id": "9f1c8b2e-3d4a-4f6b-9a1c-2e3d4a5b6c7d",
      "fullName": "Ramesh Kumar",
      "email": "manager@grandhotel.com",
      "phone": "+919812345678",
      "roleId": "b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e",
      "roleName": "Branch Manager",
      "organizationId": "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
      "organizationBranchId": "c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f",
      "profileImageUrl": "https://cdn.example.com/u/9f1c.jpg"
    }
  },
  "meta": null
}
```

### Response `200` — 2FA required

```json
{
  "success": true,
  "message": "OTP sent to registered email",
  "data": {
    "otpRequired": true,
    "otpToken": "otp_2fa_5f3a1c9b...",
    "channel": "EMAIL",
    "expiresIn": 300
  },
  "meta": null
}
```

### Errors

| Status | Code | Reason |
|--------|------|--------|
| 400 | VALIDATION_ERROR | Missing identifier/password. |
| 401 | INVALID_CREDENTIALS | Wrong identifier/password. |
| 403 | ACCOUNT_INACTIVE | User status is `INACTIVE`/`SUSPENDED`. |
| 429 | RATE_LIMITED | Too many failed attempts. |

---

## 2. Refresh Token

`POST /auth/refresh`  · **Public** (requires valid refresh token)

### Request

```json
{ "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
```

### Response `200`

```json
{
  "success": true,
  "message": "Token refreshed",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI...",
    "expiresIn": 900
  },
  "meta": null
}
```

### Errors

| Status | Code | Reason |
|--------|------|--------|
| 401 | INVALID_REFRESH_TOKEN | Expired/blacklisted/malformed. |
| 401 | TOKEN_INVALIDATED | `tokenVersion` changed (logout-all/password change). |

---

## 3. Logout

`POST /auth/logout`  · **Bearer**

Blacklists the current access + refresh token pair.

### Request

```json
{ "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI9..." }
```

### Response `200`

```json
{ "success": true, "message": "Logged out successfully", "data": null, "meta": null }
```

---

## 4. Logout All Sessions

`POST /auth/logout-all`  · **Bearer**

Increments the user's `tokenVersion`, invalidating **all** issued tokens.

### Response `200`

```json
{ "success": true, "message": "All sessions terminated", "data": { "tokenVersion": 8 }, "meta": null }
```

---

## 5. Current User (`me`)

`GET /auth/me`  · **Bearer**

Returns the authenticated user's profile plus resolved permissions.

### Response `200`

```json
{
  "success": true,
  "message": "OK",
  "data": {
    "id": "9f1c8b2e-3d4a-4f6b-9a1c-2e3d4a5b6c7d",
    "fullName": "Ramesh Kumar",
    "email": "manager@grandhotel.com",
    "phone": "+919812345678",
    "isEmailVerified": true,
    "isPhoneVerified": false,
    "role": { "id": "b2c3d4e5-...", "name": "Branch Manager" },
    "organization": { "id": "a1b2c3d4-...", "name": "Grand Hotel Group" },
    "organizationBranch": { "id": "c3d4e5f6-...", "name": "Grand Hotel - MG Road" },
    "permissions": ["booking.create", "booking.read", "room.update", "order.read"],
    "createdAt": "2025-11-02T08:15:00.000Z"
  },
  "meta": null
}
```

---

## 6. Change Password

`POST /auth/change-password`  · **Bearer**

On success, bumps `tokenVersion` (all other sessions are logged out).

### Request

```json
{
  "currentPassword": "SecurePass@123",
  "newPassword": "EvenStronger@456"
}
```

### Response `200`

```json
{
  "success": true,
  "message": "Password changed. Please log in again on other devices.",
  "data": { "tokenVersion": 9 },
  "meta": null
}
```

### Errors

| Status | Code | Reason |
|--------|------|--------|
| 401 | INVALID_CURRENT_PASSWORD | `currentPassword` wrong. |
| 400 | WEAK_PASSWORD | Fails complexity policy. |

---

## 7. Forgot Password (request OTP)

`POST /auth/forgot-password`  · **Public**

Sends a reset OTP to the account's email/phone. Always returns `200` even if the identifier doesn't exist (prevents enumeration).

### Request

```json
{ "identifier": "manager@grandhotel.com", "channel": "EMAIL" }
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `identifier` | string | Yes | Email or phone. |
| `channel` | enum | No | `EMAIL` \| `SMS`. Default `EMAIL`. |

### Response `200`

```json
{
  "success": true,
  "message": "If the account exists, an OTP has been sent",
  "data": { "otpToken": "otp_reset_1a2b3c...", "expiresIn": 300, "channel": "EMAIL" },
  "meta": null
}
```

---

## 8. Reset Password (with OTP)

`POST /auth/reset-password`  · **Public**

### Request

```json
{
  "otpToken": "otp_reset_1a2b3c...",
  "otp": "482913",
  "newPassword": "BrandNew@789"
}
```

### Response `200`

```json
{ "success": true, "message": "Password reset successful", "data": null, "meta": null }
```

### Errors

| Status | Code | Reason |
|--------|------|--------|
| 400 | INVALID_OTP | Wrong OTP code. |
| 410 | OTP_EXPIRED | OTP window elapsed. |
| 429 | OTP_ATTEMPTS_EXCEEDED | Too many wrong tries. |

---

## 9. Send OTP

`POST /auth/send-otp`  · **Public/Bearer**

Generic OTP issuer for email/phone verification or 2FA completion. Writes a `userOtp` row.

### Request

```json
{
  "identifier": "+919812345678",
  "purpose": "PHONE_VERIFICATION",
  "channel": "SMS"
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `identifier` | string | Yes | Email or phone. |
| `purpose` | enum | Yes | `EMAIL_VERIFICATION` \| `PHONE_VERIFICATION` \| `LOGIN_2FA` \| `PASSWORD_RESET`. |
| `channel` | enum | Yes | `EMAIL` \| `SMS`. |

### Response `200`

```json
{
  "success": true,
  "message": "OTP sent",
  "data": { "otpToken": "otp_ph_9c8b7a...", "expiresIn": 300, "resendAfter": 30 },
  "meta": null
}
```

---

## 10. Verify OTP

`POST /auth/verify-otp`  · **Public/Bearer**

Verifies an OTP. For `LOGIN_2FA` it returns the full token pair; for verifications it marks the field verified.

### Request

```json
{
  "otpToken": "otp_2fa_5f3a1c9b...",
  "otp": "739204"
}
```

### Response `200` — verification purpose

```json
{
  "success": true,
  "message": "Phone verified successfully",
  "data": { "purpose": "PHONE_VERIFICATION", "verified": true },
  "meta": null
}
```

### Response `200` — LOGIN_2FA purpose

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOi...",
    "refreshToken": "eyJhbGciOi...",
    "expiresIn": 900,
    "user": { "id": "9f1c8b2e-...", "fullName": "Ramesh Kumar" }
  },
  "meta": null
}
```

### Errors

| Status | Code | Reason |
|--------|------|--------|
| 400 | INVALID_OTP | Wrong code. |
| 410 | OTP_EXPIRED | Expired. |
| 429 | OTP_ATTEMPTS_EXCEEDED | Locked after N attempts. |

---

## 11. Resend OTP

`POST /auth/resend-otp`  · **Public**

Re-issues the OTP for an active `otpToken`. Rate-limited by `resendAfter`.

### Request

```json
{ "otpToken": "otp_ph_9c8b7a..." }
```

### Response `200`

```json
{
  "success": true,
  "message": "OTP resent",
  "data": { "otpToken": "otp_ph_9c8b7a...", "expiresIn": 300, "resendAfter": 30 },
  "meta": null
}
```

### Errors

| Status | Code | Reason |
|--------|------|--------|
| 429 | RESEND_TOO_SOON | Requested before `resendAfter` window. |
| 410 | OTP_SESSION_EXPIRED | `otpToken` no longer valid. |