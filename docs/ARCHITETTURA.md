# Architettura del Progetto — Treemme Frontend

**Progetto:** `netevo-default-frontend` v1.8.8  
**Dominio:** Gestionale per conceria (Conceria Treemme)  
**Package type:** ESM, privato

---

## Tech Stack

| Layer | Tecnologia |
|-------|-----------|
| UI Framework | React 19.2 |
| Linguaggio | TypeScript 5.9 (strict, `verbatimModuleSyntax`, `exactOptionalPropertyTypes`) |
| Build Tool | Vite 7.3 |
| Routing | react-router v7.12 |
| Stato Client | Zustand 5 |
| Stato Server | TanStack React Query 5 |
| API Client | Axios 1.13 |
| UI Library | MUI (Material-UI) 7.3 + `@mui/x-date-pickers` + `@mui/x-tree-view` |
| Styling | Emotion (`@emotion/react`, `@emotion/styled`) |
| Pannelli MDI | Dockview 5 |
| Form | react-hook-form 7.71 |
| Tabelle | material-react-table 3 (MRT, built on TanStack Table) |
| i18n | i18next 25 + react-i18next 15 + HTTP backend |
| Notifiche | notistack 3 |
| Date | dayjs 1.11 (con locale IT) |
| Immutabilità | immer 11.1 |

---

## Struttura delle Directory

```
treemme-frontend/
├── .env.development          # VITE_API=https://api.treemme.lan
├── .env.staging              # VITE_API=https://api.treemme.netevolution.it
├── .env.production           # VITE_API=https://api.conceria-treemme.it
│
├── index.html                # Dev chooser (escluso dal build production)
├── app-default.html          # Entry HTML per l'app "default"
├── vite.config.ts            # Config build + alias + multi-app
├── tsconfig.json             # TypeScript strict config
├── eslint.config.js          # ESLint flat config
├── generate-panel.js         # Script CLI per scaffolding nuovi pannelli
│
├── public/
│   ├── locales/              # File di traduzione i18n
│   │   ├── it/               #   common.json, default-login.json, form.json,
│   │   └── en/               #   settings.json, menu.json (solo IT)
│   ├── imgs/
│   │   ├── favicon.png
│   │   └── watermark.png     # Immagine watermark dockview (nessun pannello aperto)
│
├── src/
│   ├── i18n.ts               # Init i18next + dayjs locale sync
│   ├── vite-env.d.ts
│   │
│   ├── apps/                 # ★ Entry point multi-app
│   │   └── default/
│   │       ├── main.tsx      # createRoot + StrictMode
│   │       └── default.tsx   # Provider hierarchy root
│   │
│   ├── features/             # ★ 10 feature moduli (feature-sliced)
│   │   ├── auth/             #   Autenticazione (login, OTP, logout)
│   │   ├── authz/            #   Autorizzazione (permessi resource-action)
│   │   ├── file/             #   File (visura PDF subappalto)
│   │   ├── panels/           #   ● Pannelli dockview (il grosso dell'app)
│   │   ├── password-reset/   #   Reset password a step
│   │   ├── profile/          #   Profilo utente
│   │   ├── routing/          #   Routing + guard + route protette
│   │   ├── search/           #   SearchBar + filtri
│   │   ├── settings/         #   Impostazioni
│   │   └── user/             #   Gestione utenti e ruoli
│   │
│   └── shared/               # ★ Moduli condivisi
│       ├── api/              #   Axios instance, useApi, query keys, snackbar
│       ├── dev-tools/        #   FAB sviluppo (skipAuth, skipOtp, mock)
│       ├── helpers/          #   languageDetection
│       ├── interfaces/       #   ILanguageCode, tipi generici
│       ├── themes/           #   Tema MUI chiaro/scuro + dockview theme
│       └── ui/               #   ● Libreria componenti riusabili
│           ├── container/    #     BaseSettingsContainer
│           ├── dialog/       #     BaseDialog, DeleteConfirm, SaveConfirm
│           ├── form/         #     Campi controllati + filtri react-hook-form
│           ├── layout/       #     Layout, Menu, AppBar
│           ├── panel/        #     PanelContext, store dockview/store panel
│           ├── table/        #     MRT default options + prop factories
│           ├── tooltip/      #     HelpTooltip
│           └── ...           #     ButtonGoBack, ThemeSwitch, LanguageSelector
```

---

## Path Alias

I path alias sono definiti in **tsconfig.json** e **vite.config.ts** all'unisono:

| Alias | Path reale |
|-------|-----------|
| `@apps/*` | `src/apps/*` |
| `@features/*` | `src/features/*` |
| `@pages/*` | `src/pages/*` |
| `@shared/*` | `src/shared/*` |
| `@ui/*` | `src/shared/ui/*` |
| `@api/*` | `src/shared/api/*` |
| `@helpers/*` | `src/shared/helpers/*` |
| `@interfaces/*` | `src/shared/interfaces/*` |
| `@themes/*` | `src/shared/themes/*` |

---

## Build System

### Modalità di build

| Script | Uso |
|--------|-----|
| `npm run dev:default` | Dev server su `app-default.html` |
| `npm run build:default:production` | Build produzione (TS check + Vite) |
| `npm run build:default:staging` | Build staging |
| `npm run build:default:local` | Build development |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |

### Multi-App

L'architettura supporta più app tramite `src/apps/`. Attualmente esiste solo `default/`.

- Ogni app ha il proprio entry HTML (es. `app-default.html`) che referenzia `src/apps/default/main.tsx`
- La variabile `BUILD_TARGET=default` fa sì che Vite buildi solo l'app specificata
- Dopo il build, il plugin `renameHtmlPlugin` rinomina `app-default.html` → `index.html` nella `dist/`

### Environment

Tre file `.env.*` corrispondono ai tre ambienti Vite. Espongono:
- `VITE_API` — URL base del backend
- `VITE_BUILD_VERSION` — identificativo ambiente

---

## Provider Hierarchy

L'ordine dei provider in `src/apps/default/default.tsx` è:

```
BrowserRouter
└── QueryClientProvider (TanStack React Query)
    └── AuthProvider (contesto auth: whoami, login, logout)
        └── CustomThemeProvider (MUI light/dark + persist localStorage)
            └── SnackbarProvider (notistack custom)
                └── LayoutProvider (visibilità layout)
                    └── RoutingDefault (react-router Routes)
                    └── DevTools (DEV mode)
        └── ReactQueryDevtools (DEV mode)
```

---

## Routing

Il routing è organizzato in 3 layer:

### 1. `RoutingDefault.tsx` (app-specifico)
- **Rotte pubbliche** (no auth): `/login`, `/login/otp`, `/login/otp/setup`
- **Rotte auth senza layout**: `/file/batch/:id`, `/change-password`
- **Rotte protette** (auth + ruolo Admin/Staff + Layout): tutte le route dei pannelli
- **Wildcard**: `/` → redirect a `/app`

### 2. `ProtectedRoutes.tsx`
Filtra dinamicamente le `IRouteConfig[]` in base ai permessi dell'utente (`accessControl`).

### 3. `defaultProtectedRoutes.tsx`
Definisce le route protette di default:
- `/` → redirect a `/app`
- `/app` → workspace dockview
- `/settings`
- `/profile`

### Auth Guard
`AuthUserGuard.tsx` verifica `isAuthenticated` dal context; se non autenticato, redirect a `/login`.

### Route Config
```ts
interface IRouteConfig {
    path?: string;
    index?: boolean;
    element: ReactNode;
    children?: IRouteConfig[];
    permissionCheck?: { resource: ResourceName; action: Action };
    fallbackElement?: ReactNode;
}
```

---

## i18n e Localizzazione

**Init:** `src/i18n.ts`

- `APP_ID = "default"` — usato per namespacing con `appNs(name)` → `"default-{name}"`
- Lingue supportate: `it`, `en`
- Fallback: `it`
- Backend: HTTP → `/locales/{{lng}}/{{ns}}.json`
- Language detector custom: URL param → localStorage → browser (Safari-aware) → default IT
- Dayjs locale sincronizzato con la lingua i18next

### File di traduzione

```
public/locales/
├── it/
│   ├── common.json         # Testi comuni, bottoni, errori
│   ├── default-login.json  # Pagina di login
│   ├── form.json           # Etichette campi form
│   ├── settings.json       # Impostazioni
│   └── menu.json           # Voci di menu (solo IT)
└── en/
    ├── common.json
    ├── default-login.json
    ├── form.json
    └── settings.json
```

---

## Tema MUI

Definito in `src/shared/themes/defaultThemeGlobal.ts`:

- Tema **chiaro** e **scuro** completi
- Palette estesa:
  - `background.panel`, `background.topBar`, `background.card`
  - `tableColors`
- Scrollbar styling personalizzato
- Override componenti MUI (Tab, Button, TextField, Select, ecc.)
- Modalità persistita in `localStorage`
- Dev flag `useBlueTheme` per colore primario alternativo
- Dockview temizzato via CSS variable overrides in `dockviewTheme.tsx`

---

## Dev Tools

`src/shared/dev-tools/DevTools.tsx`:
- FAB fluttuante con drawer contenente feature flag:
  - `skipOtp` — salta verifica OTP
  - `skipAuth` — salta autenticazione (usa mock user)
  - `apiDelay` — ritardo artificiale API
  - `useBlueTheme` — tema blu alternativo
- Flag persistiti in `localStorage`
- Mock user Admin in `mock/UserMock.ts`
- Dev response interceptor per manipolare risposte API

---

## Sistema di Permessi

**Combinazione** di role-based (Admin/Staff) e resource-action-based.

**Risorse** (nomi in italiano): `contatti - cap`, `produzione - lotti`, `sistema - utenti`, ecc.

**Azioni:** `get`, `post`, `put`, `delete`.

**3 livelli di verifica:**
1. **Componente:** `<PermissionGuard resource="..." action="...">` — rende children o fallback
2. **Hook:** `useHasPermission(resource, action)` — ritorna boolean
3. **Engine:** `permissionEngine()` — API completa per verifiche avanzate

Il menu e le route vengono filtrati automaticamente in base ai permessi dell'utente.
