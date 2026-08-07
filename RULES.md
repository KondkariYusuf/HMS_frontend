# 🛡️ Production Engineering Standards & Architecture Rules (`RULES.md`)

This document defines the strict, production-grade coding standards and architecture rules for full-stack web application development (**React Frontend + Node.js Backend**). 

It is designed to eliminate beginner anti-patterns, guarantee clean code organization, and serve as an **AI System Prompt Directive** for automated coding tools.

---

## 🤖 Section 0: Copy-Pasteable AI Prompt System Header

> **Instructions for AI Assistant / Prompting**:
> When generating code for this repository, you **MUST** strictly adhere to all rules outlined in `RULES.md`. Ensure:
> 1. Every component is co-located in its own folder with a `.jsx` and `.module.css` file.
> 2. Zero hardcoded colors or pixel values — always use CSS design tokens via `var(...)`.
> 3. Zero inline styles — all styling belongs in CSS Modules.
> 4. Top JSDoc block headers on every file detailing component purpose, props, and design references.
> 5. Pure functional components, clean state management, and strict defensive error handling.

---

## 📁 Section 1: File & Folder Naming Conventions

### 1.1 Frontend Structure Rules
- **Component Folders**: Every component lives in its own PascalCase folder under `src/components/ComponentName/`.
- **Co-located Files**: A component folder contains:
  - `ComponentName.jsx` (Primary component code)
  - `ComponentName.module.css` (Co-located styles)
- **Pages**: Screens/routes live under `src/pages/PageName/Index.jsx` and `Index.module.css`.
- **Custom Hooks**: Named `useCamelCase.js` placed inside `src/hooks/`.
- **Utilities**: Named `camelCase.js` placed inside `src/utils/`.
- **Layouts**: Named `PascalCaseLayout.jsx` inside `src/layouts/LayoutName/`.

```text
src/
├── components/
│   └── UserCard/
│       ├── UserCard.jsx
│       └── UserCard.module.css
├── pages/
│   └── Dashboard/
│       ├── Index.jsx
│       └── Index.module.css
├── hooks/
│   └── useFetchUsers.js
└── utils/
    └── formatCurrency.js
```

### 1.2 Naming Checklist
| Element | Convention | Example |
| :--- | :--- | :--- |
| **Component Files** | `PascalCase.jsx` | `DataTable.jsx` |
| **CSS Modules** | `ComponentName.module.css` | `DataTable.module.css` |
| **Hooks** | `useCamelCase.js` | `useDebounce.js` |
| **Utils / Services** | `camelCase.js` | `formatDate.js` |
| **Constants** | `UPPER_SNAKE_CASE.js` | `API_ENDPOINTS.js` |
| **API Controllers** | `camelCase.controller.js` | `user.controller.js` |
| **Database Models** | `PascalCase.model.js` | `User.model.js` |

---

## ⚛️ Section 2: Frontend & React Best Practices

### 2.1 Component Engineering Rules
1. **Single Responsibility**: One component does one job. If a component exceeds 150 lines of JSX, break it into smaller sub-components.
2. **JSDoc File Header**: Every `.jsx` file **MUST** begin with a JSDoc block detailing its purpose, design frame reference, and prop signatures.
3. **No Inline Styling**: Never write `style={{ color: 'red' }}`. All styles belong in `.module.css`. (Exception: truly dynamic runtime math like progress bar percentages `style={{ width: `${percent}%` }}`).
4. **Prop Validation**: Document expected props clearly via JSDoc or default prop values.
5. **Named Default Exports**: Export named component functions matching their file name.

```javascript
/**
 * @file UserCard.jsx
 * @description Card component displaying guest info and status badge.
 * @param {Object} props
 * @param {string} props.name - Guest full name
 * @param {'active' | 'inactive'} [props.status='active'] - User status
 */
import React from 'react';
import styles from './UserCard.module.css';

export default function UserCard({ name, status = 'active' }) {
  return (
    <div className={styles.card}>
      <h4 className={styles.name}>{name}</h4>
      <span className={`${styles.badge} ${styles[status]}`}>{status}</span>
    </div>
  );
}
```

### 2.2 React Hooks & State Rules
- **Derived State**: Do NOT create redundant `useState` for values that can be computed during render.
  - ❌ *Wrong*: `const [fullName, setFullName] = useState(firstName + ' ' + lastName)`
  - ✅ *Right*: `const fullName = `${firstName} ${lastName}``
- **`useEffect` Discipline**: Never use `useEffect` to transform data for rendering. Use hooks strictly for side effects (event listeners, subscriptions, API calls).
- **Custom Hooks**: Extract complex logic or data fetching into dedicated custom hooks (`src/hooks/`).

---

## 🎨 Section 3: Styling & Design System Discipline

### 3.1 CSS Custom Properties (Design Tokens)
- **Zero Hardcoded Colors**: Never write raw hex values (`#147a7e`) inside component styles. Always use CSS variables from `tokens.css`.
- **Exact Tokens**:
  - Primary colors: `var(--color-primary)`, `var(--color-primary-dark)`, `var(--color-primary-tint)`
  - Backgrounds & Surfaces: `var(--color-bg)`, `var(--color-surface)`
  - Typography: `var(--font-family)`, `var(--font-size-sm)`, `var(--font-size-md)`, etc.
  - Spacing scale: `var(--space-xs)` through `var(--space-2xl)`
  - Border Radii: `var(--radius-sm)`, `var(--radius-md)`, `var(--radius-lg)`, `var(--radius-full)`

```css
/* ✅ CORRECT */
.card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  padding: var(--space-lg);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
}

/* ❌ INCORRECT */
.card {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  padding: 16px;
  border-radius: 8px;
  color: #1f2937;
}
```

---

## ⚡ Section 4: Performance & Accessibility (a11y)

### 4.1 Accessibility Standards
- **Semantic HTML**: Use `<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`, `<section>`, `<article>`, `<button>`. Never wrap click handlers on generic `<div>` tags without `role="button"` and keyboard handlers.
- **Form Labels**: Every `<input>` must be associated with a `<label>` or contain `aria-label`.
- **Image Alts**: Every `<img>` tag **MUST** have a meaningful `alt` text attribute.

### 4.2 Performance Rules
- **Lazy Loading**: Use `React.lazy()` and `Suspense` for page-level route splitting.
- **Event Debouncing**: Debounce input handlers on live search inputs to prevent render thrashing.
- **Clean Subscriptions**: Always return cleanup functions in `useEffect` for timers or event listeners.

---

## 🛠️ Section 5: Backend & API Engineering Standards (Node.js/Express)

### 5.1 Layered Architecture Pattern
Maintain a strict **Controller-Service-Repository** boundary:
1. **Controllers** (`controllers/`): Handle HTTP request validation, extract params, send HTTP response envelope.
2. **Services** (`services/`): Pure business logic layer. No HTTP request/response objects allowed here.
3. **Repositories / Models** (`models/`): Database queries and data persistence rules.

```text
backend/
├── src/
│   ├── controllers/
│   │   └── reservation.controller.js
│   ├── services/
│   │   └── reservation.service.js
│   ├── models/
│   │   └── Reservation.model.js
│   ├── middlewares/
│   │   ├── errorHandler.js
│   │   └── auth.js
│   └── routes/
│       └── reservation.routes.js
```

### 5.2 API Response Envelope Standard
All REST API endpoints **MUST** return a consistent JSON response envelope:

```json
// Success Response (200 / 201)
{
  "success": true,
  "data": { ... },
  "message": "Reservation created successfully."
}

// Error Response (400 / 404 / 500)
{
  "success": false,
  "error": {
    "code": "RESERVATION_NOT_FOUND",
    "message": "No active reservation matches the provided ID."
  }
}
```

### 5.3 Defensive Error Handling & Async Wrappers
- **No Unhandled Promises**: Wrap all async controller handlers in a global async wrapper (`asyncHandler`) or try-catch blocks.
- **Centralized Error Middleware**: Express apps must use a global error handling middleware to sanitize stack traces before returning responses.

---

## ⛔ Section 6: Top 15 Beginner Anti-Patterns ("The Don'ts")

| # | Anti-Pattern | Why It Fails | Correct Approach |
| :--- | :--- | :--- | :--- |
| **1** | Hardcoding Hex Colors in CSS | Destroys dark mode & breaks design tokens | Use `var(--color-primary)` |
| **2** | Inline CSS Styles in React JSX | Causes re-renders & breaks CSS Module modularity | Use co-located `.module.css` |
| **3** | Putting Logic inside Controllers | Spaghettifies API handlers & prevents unit testing | Move business logic to `Service` layer |
| **4** | Direct DOM Manipulation (`document.querySelector`) | Breaks React virtual DOM state sync | Use React `refs` or `useState` |
| **5** | Redundant `useEffect` for Calculated Values | Triggers double render cycles | Compute variables inline during render |
| **6** | Mutating State Directly (`state.push()`) | Fails React change detection | Use immutable updates (`[...state, newItem]`) |
| **7** | Click Handlers on Unclickable `<div>` | Breaks keyboard navigation & screen readers | Use native `<button>` element |
| **8** | Missing Cleanup in `useEffect` | Causes memory leaks with timers & listeners | Return cleanup function `() => clearInterval(id)` |
| **9** | Giant Multi-thousand Line Files | Creates unmaintainable code dumps | Split into 100-150 line focused modules |
| **10** | Swallowing Try-Catch Exceptions | Hides bugs silently in production | Log errors and re-throw or return structured error |
| **11** | Using Index as Array Key (`key={index}`) | Causes UI state corruption on list reorders | Use unique IDs (`key={item.id}`) |
| **12** | Mixing Business Logic in UI Components | Hard to test & reuse | Custom hooks & helper utilities |
| **13** | Returning Inconsistent API JSON Formats | Breaks frontend API data parsing | Enforce standard `{ success, data, error }` envelope |
| **14** | Missing JSDoc / Type Comments | Developers waste time guessing object shapes | Add JSDoc headers on exported functions |
| **15** | Committing Unformatted / Unlinted Code | Degrades codebase quality | Run `npm run lint` and `npm run format` |

---

## 🎯 Verification Checklist Before Code Commit

Before submitting any pull request or finalizing code generation:
- [ ] Code passes `npm run lint` with 0 errors and 0 warnings.
- [ ] Code passes `npm run format` without syntax discrepancies.
- [ ] Every component has a matching `.module.css` file.
- [ ] No hardcoded colors or static inline styles present.
- [ ] All routes and pages build cleanly (`npm run build`).
