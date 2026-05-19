# Treemme Frontend

![alt text](https://raw.githubusercontent.com/netevolution-devs/treemme-frontend/refs/heads/main/public/imgs/watermark.png "Treemme Logo")

Software gestionale Conceria Treemme

## Variabili d'ambiente

- `VITE_BUILD_VERSION`: indica la modalità di compilazione dell'applicazione
- `VITE_API`: indica l'indirizzo delle chiamate backend

```dotenv
VITE_BUILD_VERSION=<development|staging|production>
VITE_API=xxx
```

#### Esempio

.env.development

```dotenv
VITE_BUILD_VERSION=development
VITE_API=https://api.treemme.lan
```

## Sviluppo

Avvia il server di sviluppo con il comando `npm run dev` (si prende di base il env.development)

## Build
Il processo di build si differenzia per ambiente di build. E' necessario avere l'env corretto
- env.staging: `npm run build:default:staging`
- env.production: `npm run build:default:production`

