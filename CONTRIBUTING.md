# Grand Horizon — Component Creation Checklist & Coding Conventions

When contributing new components or implementing design stubs in **Grand Horizon**, strictly adhere to this architectural checklist.

---

## 📋 Component Architecture Checklist

Every component must adhere to the following standards:

### 1. File & Directory Structure
- Create a dedicated folder under `src/components/ComponentName/`.
- Maintain co-located files: `ComponentName.jsx` and `ComponentName.module.css`.
- Name the primary export function matching the component folder name.

### 2. Mandatory JSDoc Header
Every `.jsx` component file MUST begin with a JSDoc block detailing:
- `@file` and `@description`: Purpose of the component.
- `@figmaFrame`: Exact Figma frame reference name from design specs.
- `@param`: Props documentation with types and default values.

Example:
```javascript
/**
 * @file Button.jsx
 * @description Action button component with primary, secondary, and ghost variants.
 * @figmaFrame Figma frame: Components - Button
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {'primary'|'secondary'|'ghost'} [props.variant='primary']
 */
```

### 3. Styling & CSS Modules Rules
- **CSS Modules ONLY**: Import styles as `import styles from './ComponentName.module.css'`.
- **No Inline Styles**: Never use `style={{ ... }}` except for truly dynamic runtime inline values (e.g. dynamic width percentage bars).
- **No Hardcoded Hex Colors**: Use CSS design variables defined in `src/styles/tokens.css` (e.g. `var(--color-primary)`).
- **CSS Class Annotations**: List expected CSS class names and consumed design tokens in a comment block at the top of `ComponentName.module.css`.

### 4. Code Quality & Formatting
- **No TypeScript**: Use standard Javascript (JSX).
- Run `npm run lint` before committing code to ensure zero linting errors.
- Run `npm run format` to auto-format files using Prettier.
