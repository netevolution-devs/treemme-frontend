# Treemme Frontend

Frontend del gestionale per Conceria Treemme. Applicazione React 19 con pannelli dockview, permessi resource-action e supporto multi-app.

## Variabili d'ambiente

- `VITE_BUILD_VERSION`: indica la modalità di compilazione dell'applicazione
- `VITE_API`: indica l'indirizzo delle chiamate al backend


    VITE_BUILD_VERSION=
    VITE_API=xxx

## Build
Il processo di build si differenzia per ambiente di build. E' necessario avere l'env corretto
- env.staging: `npm run build:default:staging`
- env.production: `npm run build:default:production`

## Documentazione

- [Architettura del progetto](docs/ARCHITETTURA.md) — tech stack, struttura directory, build system, routing, i18n, temi, permessi
- [Pannelli Dockview](docs/PANNELLI.md) — architettura dei pannelli, componenti generici, guida alla creazione di nuovi pannelli, pattern avanzati
- [API e TanStack Query](docs/API.md) — createPanelApiFactory, hook API, cache invalidation, comunicazione cross-pannello, dev tools

