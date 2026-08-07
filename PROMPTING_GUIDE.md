# 🤖 SyncStays HMS — AI Prompting & Anti-Slop Master Guide

This guide ensures that when you use AI coding tools (Claude, Cursor, Antigravity, ChatGPT), the generated UI and business logic are **100% production-ready, clean, modular, and free of "AI slop"** (spaghetti code, inline styles, hardcoded colors, and giant unmaintainable components).

---

## 🚫 Why AI Slop Happens (and How We Stop It)

| Common AI Anti-Pattern ("Slop") | How We Enforce Production Code |
| :--- | :--- |
| **Hardcoded Hex Colors** (`#147a7e`, `#ffffff`) | Force AI to use `tokens.css` variables (`var(--color-primary)`). |
| **Inline CSS Styles** (`style={{ margin: 10 }}`) | Mandate CSS Modules (`*.module.css`) with zero inline styles. |
| **Monolithic 500-Line Components** | Enforce <150 line functional components with sub-component splitting. |
| **Inline `fetch()` Requests in JSX** | Mandate custom hooks (`src/hooks/`) and `src/utils/apiClient.js`. |
| **Silent Error Handling & Missing States** | Require explicit Loading, Error Banner, Empty Data, and Retry UI states. |
| **Unclickable `<div>` Buttons** | Require semantic HTML (`<button>`, `<section>`, `<header>`) + keyboard accessibility. |

---

## 📐 The "Context Triad" Prompt Formula

To get 100% accurate code, **every prompt MUST provide 3 anchor points**:

```text
┌──────────────────────────────────────────────────────────┐
│                   THE CONTEXT TRIAD                      │
├──────────────────────────────────────────────────────────┤
│ 1. VISUAL ANCHOR   ➔ Figma Frame Screenshot / Layout     │
│ 2. BACKEND ANCHOR  ➔ Endpoint Spec in backendMD/         │
│ 3. TARGET FILE     ➔ Exact src/ path & CSS Module        │
└──────────────────────────────────────────────────────────┘
```

---

## 📄 Master Copy-Paste Prompt Templates

### Template 1: Building a Complete Page Screen (Figma + backendMD)

> **Prompt Header Directive**:
> *You are working in the SyncStays HMS repository. You MUST strictly follow `RULES.md` and `EMPLOYEE_GUIDE.md`. Zero inline styles, zero hardcoded hex colors (use `tokens.css`), co-located CSS modules, and standard JSDoc headers.*
>
> **Task**: Implement the page `src/pages/Hotel/Rooms/Index.jsx` and `Index.module.css`.
>
> **1. Visual Reference**: Matching Figma frame for "Hotel / Rooms Management Screen".
> **2. API Reference**: Endpoint spec from `backendMD/09-rooms-setup.md` (`GET /api/v1/rooms`, `POST /api/v1/rooms`).
> **3. Technical Requirements**:
> - Create custom hook `useRooms` in `src/hooks/useRooms.js` using `apiClient.js`.
> - Handle 4 visual states: Loading (skeleton/spinner), Error (alert banner with retry button), Empty Data (empty state placeholder), and Success (Data Grid).
> - Use existing reusable components from `src/components/` (`DataTable`, `KpiCard`, `Badge`, `Button`, `Modal`).
> - Styling MUST consume CSS Custom Properties from `src/styles/tokens.css` via `Index.module.css`.
> - Do NOT use hardcoded colors or inline CSS.
>
> Generate the code cleanly split into `useRooms.js`, `Index.jsx`, and `Index.module.css`.

---

### Template 2: Building a Complex Interactive Component / Overlay

> **System Directive**: Strictly follow `RULES.md`. Co-located CSS Module, zero inline styling, JSDoc block header.
>
> **Task**: Implement `src/components/CreateBookingModal/CreateBookingModal.jsx` and `CreateBookingModal.module.css`.
>
> **Requirements**:
> - Wrap inside existing `<Modal>` overlay component (`src/components/Modal/Modal.jsx`).
> - Form fields: Guest Select (autocomplete), Room Category Dropdown, Check-In Date, Check-Out Date, Advance Deposit Input.
> - Form validation: Ensure Check-Out date is after Check-In date. Display inline field error messages.
> - Submit handler: Call `api.post('/hotel/reservations', payload)` with button disabled & spinner state during request.
> - Success feedback: Trigger `<Toast>` on success and reset form state.
> - Accessibility: Form labels bound to inputs, ESC key closes modal, keyboard tab focus trapped inside modal.

---

### Template 3: Building a Service Layer & Custom React Hook

> **Task**: Implement a custom data hook in `src/hooks/usePOSMenu.js` for the Restaurant POS module.
>
> **Requirements**:
> - Backend Reference: `backendMD/13-menu.md` (`GET /api/v1/restaurant/menu/categories`, `GET /api/v1/restaurant/menu/items`).
> - Use central client `apiClient.js` from `src/utils/apiClient.js`.
> - Provide reactive state: `categories`, `activeCategory`, `items`, `searchQuery`, `loading`, `error`, and `refetch()`.
> - Add client-side category filtering and search query debouncing (300ms).
> - Ensure defensive error handling: throw standard `ApiError` message to UI.

---

### Template 4: Anti-Slop Code Refactoring Prompt (Fixing AI Bad Code)

If an AI tool generated messy code, paste this prompt to clean it up:

> **Refactor Request**:
> Please refactor the attached component to comply with `RULES.md` and eliminate AI slop:
> 1. Extract all hex colors (`#...`) into matching `tokens.css` variables (e.g. `var(--color-primary)`).
> 2. Remove all inline `style={{ ... }}` objects and move them to `.module.css`.
> 3. Separate data fetching logic into a dedicated hook (`src/hooks/`).
> 4. Ensure every function and prop signature has JSDoc documentation.
> 5. Replace non-semantic `<div onClick={...}>` with semantic `<button>` elements.

---

## 🎯 Final Pre-Prompting Checklist

Before executing any AI prompt:
- [ ] Have you referenced [RULES.md](file:///c:/Users/kondk/OneDrive/Desktop/Projects/Nexoresha/HMS_frontend/frontend/RULES.md)?
- [ ] Have you attached the Figma frame screenshot or frame name?
- [ ] Have you specified the target markdown file in `backendMD/`?
- [ ] Have you specified exact file paths in `src/`?
