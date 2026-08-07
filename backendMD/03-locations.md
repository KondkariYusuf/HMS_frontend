# 03 — Locations (Country / State / City)

Global geographic reference data used across addresses (branches, suppliers, guests, customers).

**Entities:** `country`, `state`, `city`
**Base path:** `/api/v1`
**Frontend module:** Address pickers (cascading dropdowns), Admin → Location master.

> These are **global** tables (super-admin managed). All tenants can **read**; only super-admin can mutate. Reads are typically cached client-side.

---

## Endpoint Summary

| # | Action | Method | Path | Auth | Permission |
|---|--------|--------|------|------|------------|
| 1 | List countries | GET | `/countries` | Bearer | `location.read` |
| 2 | Get country | GET | `/countries/:id` | Bearer | `location.read` |
| 3 | Create country | POST | `/countries` | Super-admin | `location.manage` |
| 4 | Update country | PATCH | `/countries/:id` | Super-admin | `location.manage` |
| 5 | Delete country | DELETE | `/countries/:id` | Super-admin | `location.manage` |
| 6 | List states | GET | `/states` | Bearer | `location.read` |
| 7 | Create state | POST | `/states` | Super-admin | `location.manage` |
| 8 | Update state | PATCH | `/states/:id` | Super-admin | `location.manage` |
| 9 | Delete state | DELETE | `/states/:id` | Super-admin | `location.manage` |
| 10 | List cities | GET | `/cities` | Bearer | `location.read` |
| 11 | Create city | POST | `/cities` | Super-admin | `location.manage` |
| 12 | Update city | PATCH | `/cities/:id` | Super-admin | `location.manage` |
| 13 | Delete city | DELETE | `/cities/:id` | Super-admin | `location.manage` |

---

## Country

### List — `GET /countries`

Searchable: `name`, `iso2`, `iso3`. No pagination needed if `limit` high; still supports it.

```json
{
  "success": true,
  "message": "OK",
  "data": [
    { "id": "ctry-in", "name": "India", "iso2": "IN", "iso3": "IND", "phoneCode": "+91", "currencyCode": "INR" },
    { "id": "ctry-us", "name": "United States", "iso2": "US", "iso3": "USA", "phoneCode": "+1", "currencyCode": "USD" }
  ],
  "meta": { "page": 1, "limit": 300, "total": 2, "totalPages": 1, "hasNext": false, "hasPrev": false }
}
```

### Create — `POST /countries`

```json
{ "name": "India", "iso2": "IN", "iso3": "IND", "phoneCode": "+91", "currencyCode": "INR" }
```

Response `201` → created object.

#### Errors

| Status | Code | Reason |
|--------|------|--------|
| 409 | DUPLICATE_ISO | `iso2`/`iso3` already exists. |

---

## State

### List — `GET /states`

Filter: `countryId` (required for cascading dropdown). Searchable: `name`, `code`.

`GET /states?countryId=ctry-in`

```json
{
  "success": true,
  "message": "OK",
  "data": [
    { "id": "st-ka", "name": "Karnataka", "code": "KA", "countryId": "ctry-in" },
    { "id": "st-mh", "name": "Maharashtra", "code": "MH", "countryId": "ctry-in" }
  ],
  "meta": { "page": 1, "limit": 100, "total": 2, "totalPages": 1, "hasNext": false, "hasPrev": false }
}
```

### Create — `POST /states`

```json
{ "name": "Karnataka", "code": "KA", "countryId": "ctry-in" }
```

Response `201` → created object.

---

## City

### List — `GET /cities`

Filter: `stateId` (required for cascading dropdown), `countryId`. Searchable: `name`.

`GET /cities?stateId=st-ka&search=beng`

```json
{
  "success": true,
  "message": "OK",
  "data": [
    { "id": "city-blr", "name": "Bengaluru", "stateId": "st-ka", "countryId": "ctry-in", "latitude": "12.9716", "longitude": "77.5946" }
  ],
  "meta": { "page": 1, "limit": 20, "total": 1, "totalPages": 1, "hasNext": false, "hasPrev": false }
}
```

### Create — `POST /cities`

```json
{ "name": "Bengaluru", "stateId": "st-ka", "countryId": "ctry-in", "latitude": "12.9716", "longitude": "77.5946" }
```

Response `201` → created object.

#### Errors

| Status | Code | Reason |
|--------|------|--------|
| 404 | STATE_NOT_FOUND | `stateId` invalid. |
| 422 | STATE_COUNTRY_MISMATCH | `stateId` does not belong to `countryId`. |

---

## Cascading Usage (Frontend hint)

```mermaid
graph LR
  A[Select Country GET /countries] --> B[Select State GET /states?countryId=X]
  B --> C[Select City GET /cities?stateId=Y]
  C --> D[cityId stored on branch / supplier / guest]
```

- Address-owning entities store only `cityId`; `stateId`/`countryId` are derivable via joins.