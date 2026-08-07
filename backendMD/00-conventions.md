# API Conventions

Global standards that apply to **every** endpoint in this system. Individual module files only document what differs from these defaults.

- **Stack:** Node.js + Express (JavaScript), PostgreSQL, JWT auth.
- **Base URL:** `/api/v1`
- **Content-Type:** `application/json` (except file uploads → `multipart/form-data`).

---

## 1. Authentication

- All endpoints require a JWT **Bearer** token unless explicitly marked `Public`.
- Header: `Authorization: Bearer <accessToken>`
- The token payload carries `userId`, `organizationId`, `organizationBranchId`, `roleId`, and `tokenVersion`.
- **Tenancy is resolved server-side from the token.** Clients **never** send `organizationId` / `organizationBranchId` in request bodies — the middleware injects them.
- `tokenVersion` mismatch (e.g. after change-password / logout-all) → `401 TOKEN_INVALIDATED`.

### Standard Auth Headers

| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes (protected) | `Bearer <accessToken>` |
| `x-branch-id` | Optional | Override active branch for multi-branch users (must be a branch the user belongs to). Falls back to token branch. |

---

## 2. Response Envelope

Every response (success or error) uses this envelope:

```json
{
  "success": true,
  "message": "Human-readable message",
  "data": {},
  "meta": null
}
```

- `success` — boolean.
- `message` — short human-readable status.
- `data` — object / array / null (the payload).
- `meta` — pagination or extra metadata, `null` when not applicable.

### List (paginated) `meta`

```json
{
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 137,
    "totalPages": 7,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## 3. List / Query Parameters

All list (`GET` collection) endpoints support:

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | int | 1 | Page number (1-based). |
| `limit` | int | 20 | Items per page (max 100). |
| `search` | string | — | Free-text search across the module's searchable fields. |
| `sortBy` | string | `createdAt` | Field to sort by. |
| `sortOrder` | enum | `desc` | `asc` \| `desc`. |
| `status` | enum | — | Filter by the entity's status enum. |
| `includeDeleted` | bool | false | Include soft-deleted rows (admin only). |

Module-specific filters (e.g. `roomTypeId`, `fromDate`, `toDate`) are documented per module.

---

## 4. Standard CRUD Pattern

Unless a module states otherwise, each primary entity exposes:

| Action | Method | Path | Body | Returns |
|--------|--------|------|------|---------|
| List | `GET` | `/resource` | — | Array + pagination `meta` |
| Get one | `GET` | `/resource/:id` | — | Single object |
| Create | `POST` | `/resource` | Create DTO | Created object |
| Update | `PATCH` | `/resource/:id` | Partial DTO | Updated object |
| Delete | `DELETE` | `/resource/:id` | — | `{ id, deletedAt }` (soft delete) |

- **Create** returns `201`.
- **Update** is `PATCH` (partial). Full replace (`PUT`) is not used.
- **Delete** is a **soft delete** — sets `deletedAt`, row is excluded from default lists.

---

## 5. Common Field Conventions

- All IDs are **UUID v4**.
- Timestamps are **ISO 8601 UTC** strings (e.g. `2026-01-15T10:30:00.000Z`).
- Money fields are strings/numbers with 2 decimals (`"1500.00"`), matching `decimal(12,2)`.
- Every entity returns `id`, `createdAt`, `updatedAt`, and (soft-deletable ones) `deletedAt`.
- Audit fields (`createdBy`) are set server-side from the token, never from the client.

---

## 6. Error Format

```json
{
  "success": false,
  "message": "Validation failed",
  "data": null,
  "meta": {
    "code": "VALIDATION_ERROR",
    "errors": [
      { "field": "email", "message": "email must be a valid email" }
    ]
  }
}
```

### Standard HTTP Status Codes

| Code | When |
|------|------|
| `200` | Success (read / update / action) |
| `201` | Resource created |
| `400` | Validation / bad request (`VALIDATION_ERROR`) |
| `401` | Missing/invalid/expired token (`UNAUTHORIZED`, `TOKEN_INVALIDATED`) |
| `403` | Authenticated but lacks permission (`FORBIDDEN`) |
| `404` | Resource not found (`NOT_FOUND`) |
| `409` | Conflict — unique constraint / invalid state transition (`CONFLICT`) |
| `422` | Business rule violation (e.g. room not available, insufficient stock) |
| `429` | Rate limited (`RATE_LIMITED`) |
| `500` | Server error (logged to `errorLogger`) |

---

## 7. Permissions (RBAC)

- Each protected endpoint maps to a `permission.code` (e.g. `booking.create`, `room.update`).
- Middleware checks the user's `role → roleSubModule → subModule → modulePermission → permission`.
- Failing the check → `403 FORBIDDEN`.
- Permission codes are listed in each module file's endpoint table under the **Permission** column.

---

## 8. Soft Delete & Timestamps

- Tables with `deletedAt` support soft delete; default queries filter `deletedAt IS NULL`.
- Tables **without** `deletedAt` (logs, join tables like `roleSubModule`) are hard-deleted.
- Restore (where supported): `POST /resource/:id/restore`.

---

## 9. Audit Logging

- All `CREATE` / `UPDATE` / `DELETE` on business entities auto-write to `auditLog` (old/new value diff) via middleware.
- `LOGIN` / `LOGOUT` events are written on auth actions.
- No separate client call needed — it is transparent.

---

## 10. Idempotency & Concurrency

- Money/stock-mutating workflow endpoints (payments, stock adjustments, check-in/out) accept an optional `Idempotency-Key` header to prevent duplicate submission.
- Optimistic concurrency: send `If-Unmodified-Since` or the entity's `updatedAt`; a mismatch → `409 CONFLICT`.

---

## 11. Multi-Tenant Scoping Rules

| Scope level | Tables | Rule |
|-------------|--------|------|
| Global (platform) | `currency`, `country`, `state`, `city`, `module`, `subModule`, `permission`, `subscriptionPlan`, `organizationType` | Managed by super-admin; readable by all tenants. |
| Organization | `organization`, `role`, `organizationSubscription`, `user` (partly) | Scoped to `organizationId` from token. |
| Branch | `room`, `booking`, `order`, `product`, `stock`, `purchase`, etc. | Scoped to `organizationId` **and** `organizationBranchId`. |

Attempting to access a resource outside your org/branch → `404 NOT_FOUND` (never leaks existence).