# Treemme Frontend

![alt text](https://raw.githubusercontent.com/netevolution-devs/treemme-frontend/refs/heads/main/public/imgs/watermark.png "Treemme Logo")

Software gestionale Conceria Treemme

## Variabili d'ambiente

- `VITE_BUILD_VERSION`: indica la modalità di compilazione dell'applicazione
- `VITE_API`: indica l'indirizzo delle chiamate al backend


        VITE_BUILD_VERSION=
        VITE_API=xxx

## Build
Il processo di build si differenzia per ambiente di build. E' necessario avere l'env corretto
- env.staging: `npm run build:default:staging`
- env.production: `npm run build:default:production`

