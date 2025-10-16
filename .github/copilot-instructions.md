# Copilot Instructions for OnebitProject

## Project Overview
This is a minimal React project bootstrapped with Vite. The architecture is simple and flat, with all source code in the `src/` directory. The main entry point is `src/main.jsx`, which renders the `App` component from `src/App.jsx`.

## Key Files & Structure
- `src/main.jsx`: React root, imports global CSS and mounts `App`.
- `src/App.jsx`: Main app component. Imports a `Card` component (not present in repo; may need to be created or fixed).
- `src/styles/global.css`: Global styles, imported in `main.jsx`.
- `src/Components/`: Intended for reusable components and assets (currently only `poster.jpg`).
- `public/`: Static assets for Vite (currently only `vite.svg`).

## Build & Development
- **Start dev server:** `npm run dev` (uses Vite)
- **Build for production:** `npm run build`
- **Preview production build:** `npm run preview`
- **Lint:** `npm run lint` (uses ESLint with custom config)

## ESLint Configuration
- Located in `eslint.config.js`.
- Uses recommended rules for JS, React Hooks, and React Refresh.
- Ignores `dist/`.
- Custom rule: Variables starting with uppercase or underscore are ignored for unused-vars.

## Patterns & Conventions
- **Component organization:** Place reusable components in `src/Components/`.
- **Global styles:** Use `src/styles/global.css` and import in `main.jsx`.
- **No TypeScript:** This template is JS-only, but can be expanded to TS if needed.
- **No backend/server code:** Pure frontend React app.
- **No test setup detected.**

## Integration Points
- **Vite plugins:** Uses `@vitejs/plugin-react` for React Fast Refresh.
- **ESLint plugins:** `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`.

## Common Issues
- The `Card` component is imported in `App.jsx` but not present in the repo. Create `src/Components/Card.jsx` if needed and update imports accordingly.
- Ensure all new components are imported and used in `App.jsx` or other parent components.

## Example: Adding a New Component
1. Create `src/Components/MyComponent.jsx`:
   ```jsx
   export default function MyComponent() {
     return <div>My Component</div>;
   }
   ```
2. Import and use in `App.jsx`:
   ```jsx
   import MyComponent from './Components/MyComponent';
   // ...
   <MyComponent />
   ```

---
For more details, see `README.md` and config files. Update this file if project structure or conventions change.
