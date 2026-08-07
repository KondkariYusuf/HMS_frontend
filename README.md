# Grand Horizon — Hotel Management System (HMS) Frontend Base Repository

Grand Horizon is a modern, high-performance Hotel Management System (HMS) web application built with **React 18**, **Vite**, **React Router v6**, and **CSS Modules**.

This base repository serves as an architected skeleton prepared for incremental, **screenshot-driven prompting** and visual component implementation.

---

## 🏛️ Repository Architecture & Project Structure

```text
src/
├── app/                  # Application initialization & Routing setup
│   ├── App.jsx           # Root application component with RouterProvider
│   └── router.jsx        # React Router v6 route configuration
├── pages/                # Authenticated route screens
│   ├── Dashboard/        # Index route — Primary reference overview screen
│   ├── Reservations/     # Booking management & list view
│   ├── Rooms/            # Room inventory & floor management
│   ├── Analytics/        # Operational performance & revenue metrics
│   ├── Staff/            # Staff directory & duty scheduling
│   └── Settings/         # Property & system configuration
├── components/           # Reusable UI component stubs & overlays
│   ├── SideNavBar/       # Left brand sidebar navigation
│   ├── TopNavBar/        # Header with search, tabs, notifications, avatar
│   ├── KpiCard/          # Metric card with icon, uppercase label, value, delta
│   ├── ProgressBar/      # Multi-categorical segmented bar
│   ├── ChartCard/        # Chart container with Daily/Weekly/Monthly toggle
│   ├── AgendaCard/       # Calendar item with date badge & status dot
│   ├── DataTable/        # Rich data table with avatar & status badges
│   ├── QuickActionsGrid/ # 2x2 grid of front-desk action buttons
│   ├── Timeline/         # Vertical activity event stream
│   ├── Button/           # Action buttons (primary/secondary/ghost/icon)
│   ├── Badge/            # Status pill (in-house/arriving/checked-out/VIP)
│   ├── Avatar/           # Circular profile image with ring border
│   ├── Fab/              # Floating Action Button
│   ├── Modal/            # Generic accessible overlay backdrop
│   ├── Toast/            # Feedback notification banner
│   ├── FloorConfigurationModal/ # Shared overlay: Floor planner
│   ├── SuccessFeedbackToast/    # Shared overlay: Success notification
│   └── ConfirmationModal/       # Shared overlay: Action confirmation
├── layouts/              # Layout shell wrappers
│   └── MainLayout/       # Authenticated layout shell (SideNavBar + TopNavBar + Outlet)
├── styles/               # Global styling & CSS variables
│   ├── tokens.css        # Exact Figma design tokens (CSS Custom Properties)
│   └── global.css        # CSS reset, Manrope font, base styling
├── assets/               # Static icons and image placeholders
│   ├── icons/
│   └── images/
├── hooks/                # Custom React hooks
└── utils/                # Helper utilities & formatters
```

---

## 🎨 Design System & CSS Custom Properties

Design tokens are defined in `src/styles/tokens.css` and imported globally via `src/styles/global.css`. Always consume CSS custom properties via `var(...)` in your component CSS modules.

### Available Tokens
- **Colors**:
  - `--color-primary`: `#147a7e`
  - `--color-primary-dark`: `#0f5c5e`
  - `--color-primary-tint`: `#ddf1f0`
  - `--color-bg`: `#f7f9fa`
  - `--color-surface`: `#ffffff`
  - `--color-border`: `#e5e7eb`
  - `--color-text-primary`: `#1f2937`
  - `--color-text-secondary`: `#6b7280`
  - `--color-text-muted`: `#9ca3af`
  - `--color-error`: `#b91c1c`
  - `--color-white`: `#ffffff`
- **Typography**:
  - `--font-family`: `'Manrope', sans-serif` (Weights: 400, 500, 600, 700)
  - Sizes: `--font-size-xs` (9px), `--font-size-sm` (10px), `--font-size-base` (12px), `--font-size-md` (14px), `--font-size-lg` (16px), `--font-size-xl` (18px), `--font-size-2xl` (30px)
- **Spacing Scale**:
  - `--space-xs` (4px), `--space-sm` (8px), `--space-md` (12px), `--space-lg` (16px), `--space-xl` (24px), `--space-2xl` (25px)
- **Radii**:
  - `--radius-sm` (4px), `--radius-md` (8px), `--radius-lg` (12px), `--radius-full` (9999px)
- **Shadows & Dimensions**:
  - `--shadow-card`: `0px 4px 20px -2px rgba(15,92,94,0.08)`
  - `--shadow-button-primary`: `0px 4px 6px -1px rgba(20,122,126,0.2), 0px 2px 4px -2px rgba(20,122,126,0.2)`
  - `--sidebar-width`: `260px`
  - `--topnav-height`: `64px`

---

## 🏷️ Path Aliases

Vite path aliases are configured in `vite.config.js` for clean imports:
- `@app` -> `src/app`
- `@components` -> `src/components`
- `@pages` -> `src/pages`
- `@styles` -> `src/styles`
- `@hooks` -> `src/hooks`
- `@utils` -> `src/utils`
- `@layouts` -> `src/layouts`

Example import:
```javascript
import Button from '@components/Button/Button'
import styles from './MyComponent.module.css'
```

---

## 📸 Screenshot-Driven Development Workflow

Every component and page file includes a **JSDoc top block** referencing its corresponding Figma frame and expected CSS Module tokens.

### How to prompt to implement a component/page:
1. Open the component file (e.g. `src/components/KpiCard/KpiCard.jsx`).
2. Attach a screenshot of the matching Figma frame.
3. Prompt:
   > "Implement `KpiCard.jsx` and `KpiCard.module.css` to match the attached screenshot using the existing tokens in `tokens.css` and CSS Modules structure."

---

## 🚀 NPM Scripts

```bash
# Start local development server
npm run dev

# Build production bundle
npm run build

# Preview production build locally
npm run preview

# Run ESLint check
npm run lint

# Format codebase with Prettier
npm run format
```
