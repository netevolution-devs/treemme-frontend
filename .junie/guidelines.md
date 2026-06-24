# Project Development Guidelines - Treemme Frontend

This document provides essential information for developers working on the `netevo-default-frontend` project.

## 1. Build and Configuration

### Prerequisites
- Node.js (Latest LTS recommended)
- npm

### Setup
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```

### Development
Start the development server for the default app:
```bash
npm run dev:default
```
The app will be available at `http://localhost:5173/app-default.html`.

### Build
Build for various environments:
- **Production**: `npm run build:default:production`
- **Staging**: `npm run build:default:staging`
- **Local Development Build**: `npm run build:default:local`

The build output will be in the `dist/` directory.

---

## 2. Testing Information

### Recommended Test Runner
The project currently does not have a pre-configured test runner. It is highly recommended to use **Vitest** for unit and integration testing, as it integrates seamlessly with Vite.

To set up Vitest:
```bash
npm install -D vitest @vitejs/plugin-react
```

### Running Tests
Once Vitest is configured, add these scripts to `package.json`:
```json
"scripts": {
  "test": "vitest",
  "test:run": "vitest run"
}
```
Run tests with:
```bash
npm test
```

### Adding New Tests
Place test files alongside the code they test, using the `.test.ts` or `.test.tsx` extension.

Example test for `src/shared/interfaces/ILanguageCode.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { isLanguageCode } from './ILanguageCode';

describe('isLanguageCode', () => {
  it('should return true for supported languages', () => {
    expect(isLanguageCode('en')).toBe(true);
    expect(isLanguageCode('it')).toBe(true);
  });

  it('should return false for unsupported languages', () => {
    expect(isLanguageCode('fr')).toBe(false);
    expect(isLanguageCode('invalid')).toBe(false);
  });
});
```

---

## 3. Architecture and Development

### Panel-Based UI (Dockview)
The application uses a Multiple Document Interface (MDI) based on **Dockview**. Most of the application's logic resides in "Pannels".

- **Panel Registry**: All panels must be registered in `src/features/panels/PanelRegistry.tsx`.
- **Generic Components**: Use `GenericPanel`, `GenericList`, and `GenericForm` (located in `src/features/panels/shared/`) to maintain consistency and reduce boilerplate.
- **State Management**: Each panel instance has its own isolated Zustand store created via `createPanelStore`. Access it using the `usePanel` hook within the panel's context.

### API Integration (TanStack Query)
Standard CRUD operations for panels should be implemented using the `createPanelApi` factory.

Example:
```typescript
export const myEntityApi = createPanelApi<IMyEntity>({
    baseEndpoint: "/my-entity",
    queryKey: "MY_ENTITY"
});
```
This generates hooks: `useGetList`, `useGetDetail`, `usePost`, `usePut`, `useDelete` with automatic cache invalidation.

### Code Style and Conventions
- **TypeScript**: Strict mode is enabled. Use interfaces for data models (e.g., `IMyEntity`).
- **Path Aliases**: Use `@apps`, `@features`, `@shared`, `@ui`, `@api` etc., for cleaner imports (configured in `tsconfig.json`).
- **i18n**: Use `useTranslation` hook for all UI text. Translation files are in `public/locales/`.
- **Keyboard Shortcuts**: Panels support standard shortcuts:
    - `F9`: New
    - `F4`: Edit
    - `F10`: Save
    - `Esc`: Cancel / Close

### Path Aliases Summary
| Alias | Path |
|-------|------|
| `@apps/*` | `src/apps/*` |
| `@features/*` | `src/features/*` |
| `@shared/*` | `src/shared/*` |
| `@ui/*` | `src/shared/ui/*` |
| `@api/*` | `src/shared/api/*` |

For more detailed architectural information, refer to the files in the `docs/` folder.
