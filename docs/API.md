# Sistema API e TanStack Query

> Integrazione di TanStack Query (React Query), factory `createPanelApi`, strategie di cache invalidation e comunicazione tra pannelli.

---

## Indice

1. [Architettura Generale](#1-architettura-generale)
2. [Il layer Axios / useApi](#2-il-layer-axios--useapi)
3. [La factory createPanelApiFactory](#3-la-factory-createpanelapifactory)
4. [Hook API manuali (feature specifici)](#4-hook-api-manuali-feature-specifici)
5. [Cache Invalidation](#5-cache-invalidation)
6. [Comunicazione Cross-Pannello via Cache](#6-comunicazione-cross-pannello-via-cache)
7. [QueryKeyStrings](#7-querykeystrings)
8. [DevTools e API](#8-devtools-e-api)
9. [Pattern di Utilizzo](#9-pattern-di-utilizzo)

---

## 1. Architettura Generale

```
┌────────────────────────────────────────────────────────────────────┐
│                        React Component                             │
│  useQuery / useMutation / useQueryClient                           │
│       │                                                            │
│       ▼                                                            │
│  ┌──────────────────────────────────────────────────────────┐      │
│  │              createPanelApiFactory (o hook manuale)       │      │
│  │  ┌────────────────────────────────────────────────────┐  │      │
│  │  │   useApi() → { get, post, postEncoded, put, DELETE }│  │      │
│  │  └────────────────────────────────────────────────────┘  │      │
│  └──────────────────────────────────────────────────────────┘      │
│       │                                                            │
│       ▼                                                            │
│  ┌──────────────────────────────────────────────────────────┐      │
│  │               customAxiosInstance                         │      │
│  │  axios.create({ withCredentials: true })                  │      │
│  │  Interceptors:                                            │      │
│  │    ● Response: devResponseInterceptor (delay, skipOTP)    │      │
│  │    ● Error: handleGenericError (network/403/500/timeout)  │      │
│  └──────────────────────────────────────────────────────────┘      │
│       │                                                            │
│       ▼                                                            │
│  ┌──────────────────────────────────────────────────────────┐      │
│  │                Backend (VITE_API)                         │      │
│  │  api.treemme.lan / api.treemme.netevolution.it / ...     │      │
│  └──────────────────────────────────────────────────────────┘      │
└────────────────────────────────────────────────────────────────────┘
```

Il sistema si compone di 3 layer:

| Layer | File | Ruolo |
|-------|------|-------|
| **Trasporto HTTP** | `customAxiosInstance.ts` | Istanza Axios con `withCredentials: true` |
| **Intercettori** | `useAxiosInstance.ts` + `devResponseInterceptor.ts` | Gestione errori, dev tools |
| **Hook API** | `useApi.ts` | Wrapper `get`/`post`/`postEncoded`/`put`/`putEncoded`/`DELETE` con appending `?lang=` |
| **Factory pannelli** | `createPanelApiFactory.ts` | Genera 5 hook TanStack Query |
| **Hook manuali** | `features/*/api/*.ts` | Hook specifici (login, whoami, user CRUD) |

### Provider Setup

```tsx
// In src/apps/default/default.tsx
<QueryClientProvider client={queryClient}>
    {/* ... provider chain ... */}
</QueryClientProvider>

// DEV only:
<ReactQueryDevtools initialIsOpen={false} />
```

`queryClient` è un'istanza singola di `QueryClient` senza configurazioni particolari (default: `staleTime: 0`, `gcTime: 5 min`).

---

## 2. Il layer Axios / useApi

### customAxiosInstance

**File:** `src/shared/api/customAxiosInstance.ts`

```tsx
export const customAxiosInstance: AxiosInstance = axios.create({
    withCredentials: true,  // cookies di sessione
});
```

- `withCredentials: true` — invia i cookie di sessione su richieste cross-origin
- Base URL: non impostato a livello di Axios; viene preposto dinamicamente in `useApi`

### useApi Hook

**File:** `src/shared/api/useApi.ts`

Hook React che espone 6 metodi HTTP. Ogni metodo:

1. Costruisce l'URL completo: `VITE_API + route + '?lang=' + linguaCorrente`
2. Invia la richiesta tramite `customAxiosInstance`
3. Ritorna la risposta tipizzata come `AxiosResponse<IGenericApiResponse<T>>`

```tsx
const { get, post, postEncoded, put, putEncoded, DELETE } = useApi();

// GET
const response = await get<T[]>("/shipping-carrier");
// → chiama GET https://api.treemme.lan/shipping-carrier?lang=it
// → response.data.data è di tipo T[]

// POST con form-urlencoded (usato per CREATE dalla factory)
const response = await postEncoded("/shipping-carrier", { name: "Test" });

// POST con JSON (usato per login)
const response = await post("/login", { email, password });

// PUT
const response = await put(`/shipping-carrier/${id}`, { name: "Nuovo" });

// DELETE
const response = await DELETE(`/shipping-carrier/${id}`);
```

**Formato risposta backend (`IGenericApiResponse<T>`):**

```tsx
{
    status: "ok" | "ko",
    status_code: number,
    error: string,          // messaggio errore se status === "ko"
    locale: string,
    pagination: number[],
    data: T                 // payload effettivo
}
```

### Response Interceptor (error handling)

**File:** `src/shared/api/useAxiosInstance.ts`

Configurato una sola volta via `useEffect`. L'interceptor di risposta gestisce:

| Condizione | Messaggio |
|-----------|-----------|
| `ERR_NETWORK` | "Errore di rete" |
| `403` | "Permesso negato" |
| `>= 500` | "Errore del server" |
| `error.response.data.error` | Il messaggio specifico dal backend |
| `ECONNABORTED` | "Richiesta scaduta" |

Tutti gli errori mostrano una notifica notistack tramite `useSnackbar`.

In **DEV mode**, la richiesta passa anche da `devResponseInterceptor.ts` che può:
- Aggiungere un ritardo artificiale di 5 secondi (`apiDelay`)
- Manipolare la risposta whoami per simulare OTP abilitato (`skipOtp`)

---

## 3. La factory createPanelApiFactory

**File:** `src/features/panels/shared/hooks/createPanelApiFactory.ts`

Factory che genera 5 hook TanStack Query per un endpoint REST, seguendo il pattern **CRUD standard** dei pannelli.

### Configurazione

```tsx
interface ApiConfig {
    baseEndpoint: string;     // es. "/shipping-carrier"
    queryKey: string;         // es. "CARRIER" — usato come prefisso query key
}

interface ApiOptions {
    queryParams?: Record<string, string | number>;   // per filtraggio lista
    staleTime?: number;                                // default Infinity per liste
    invalidateQueries?: string[];                      // query keys extra da invalidare
}
```

### Hook generati

#### `useGetList(options?)`

```tsx
useGetList: (options?: ApiOptions) => {
    const { get } = useApi();
    return useQuery({
        queryKey: [queryKey, 'LIST', ...extraKeys, ...queryParamsKeys],
        queryFn: () => get<T[]>(baseEndpoint, { params: options?.queryParams }),
        staleTime: options?.staleTime || Infinity,
        gcTime: Infinity,
    });
};
```

- **Cache permanente** (`staleTime: Infinity`, `gcTime: Infinity`) — non viene rifetchata finché non invalidata
- **Query key composta**: `["CARRIER", "LIST"]` oppure `["CARRIER", "LIST", { name: "test" }]` se ci sono filtri
- **Extra keys**: se `invalidateQueries` è specificato, vengono incluse nella query key per permettere l'invalidazione da altri hook

#### `useGetDetail(id?)`

```tsx
useGetDetail: (id?: number | null) => {
    const { get } = useApi();
    return useQuery({
        queryKey: [queryKey, 'DETAIL', id],
        queryFn: () => get<T>(`${baseEndpoint}/${id}`),
        enabled: !!id,          // eseguito solo quando id è definito
        staleTime: 0,           // sempre rifetchato
    });
};
```

- **Disabilitato** se `id` è `undefined` o `null`
- **Sempre fresco** (`staleTime: 0`) — il dettaglio deve sempre riflettere il DB

#### `usePost(options?)`

```tsx
usePost: (options?: ApiOptions) => {
    const { postEncoded: post } = useApi();
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: [queryKey, 'CREATE'],
        mutationFn: (payload: TPayload) => post(baseEndpoint, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKey, 'LIST'] });
            options?.invalidateQueries?.forEach(key => {
                queryClient.invalidateQueries({ queryKey: [key] });
            });
        }
    });
};
```

- Usa **`postEncoded`** (form-urlencoded) per il body
- Invalida automaticamente la **lista** dopo il successo
- Invalida eventuali **query keys extra** specificate

#### `usePut(options?)`

```tsx
usePut: (options?: ApiOptions) => {
    const { put } = useApi();
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: [queryKey, 'UPDATE'],
        mutationFn: ({ id, payload }) => put(`${baseEndpoint}/${id}`, payload),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [queryKey, 'LIST'] });
            queryClient.invalidateQueries({ queryKey: [queryKey, 'DETAIL', variables.id] });
            options?.invalidateQueries?.forEach(key => {
                queryClient.invalidateQueries({ queryKey: [key] });
            });
        }
    });
};
```

- Usa **`put`** standard (JSON) per il body
- Invalida sia la **lista** che il **dettaglio** dell'entità modificata

#### `useDelete(options?)`

```tsx
useDelete: (options?: ApiOptions) => {
    const { DELETE } = useApi();
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: [queryKey, 'DELETE'],
        mutationFn: (id: number) => DELETE(`${baseEndpoint}/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKey, 'LIST'] });
            options?.invalidateQueries?.forEach(key => {
                queryClient.invalidateQueries({ queryKey: [key] });
            });
        }
    });
};
```

- Invalida solo la **lista** (il dettaglio non esiste più)

### Riepilogo cache behavior

| Hook | staleTime | gcTime | Invalidation su mutate |
|------|-----------|--------|----------------------|
| `useGetList` | `Infinity` | `Infinity` | — |
| `useGetDetail` | `0` | default | — |
| `usePost` | — | — | LIST + extra |
| `usePut` | — | — | LIST + DETAIL + extra |
| `useDelete` | — | — | LIST + extra |

### Esempio d'uso

```tsx
// 1. Definizione (1 riga)
export const carrierApi = createPanelApi<ICarrier>({
    baseEndpoint: "/shipping-carrier",
    queryKey: "CARRIER"
});

// 2. Nei componenti
const { useGetList, useGetDetail, usePost, usePut, useDelete } = carrierApi;

// Leggere la lista
const { data: items, isLoading, isFetching } = useGetList({
    queryParams: { name: filterName }
});

// Leggere un dettaglio
const { data: entity } = useGetDetail(selectedId);

// Creare
const { mutateAsync: create } = usePost();
await create({ name: "Nuovo" });

// Aggiornare
const { mutateAsync: update } = usePut();
await update({ id: 5, payload: { name: "Modificato" } });

// Eliminare
const { mutateAsync: remove } = useDelete();
await remove(5);

// Con invalidazione extra (es. aggiornare anche un'altra lista)
const { mutateAsync: createWithExtra } = usePost({
    invalidateQueries: ["CONTACTS", "RELATED_LIST"]
});
```

### TPayload generico

La factory definisce `TPayload = Omit<T, 'id'>` di default, permettendo di specificare un tipo payload diverso se necessario:

```tsx
// Uso con tipo payload personalizzato
const api = createPanelApi<IBatch, IBatchPayload>({
    baseEndpoint: "/production/batch",
    queryKey: "BATCH"
});
```

---

## 4. Hook API manuali (feature specifici)

Non tutti gli useQuery/useMutation passano dalla factory. Alcune feature hanno hook custom:

### useGetWhoAmI

```tsx
// src/features/auth/api/useGetWhoAmI.ts
return useQuery({
    queryKey: [QUERY_KEY_STRINGS.USER.WHOAMI],  // ["getWhoAmI"]
    queryFn: whoAmI,
    staleTime: 1000 * 60,     // 1 minuto
    retry: false,              // non ritenta se fallisce
});
```

### usePostLogin

```tsx
// src/features/auth/api/usePostLogin.ts
return useMutation({
    mutationKey: [QUERY_KEY_STRINGS.USER.LOGIN],
    mutationFn: doPostLogin,
    onSuccess: () => {
        // Invalida whoami per riflettere il nuovo utente loggato
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY_STRINGS.USER.WHOAMI] });
    },
});
```

### useGetUserList

```tsx
// src/features/user/api/useGetUserList.ts
return useQuery({
    queryKey: [QUERY_KEY_STRINGS.USER.LIST, type],  // ["getUsers", "backoffice"]
    queryFn: doGetUserList,
    enabled,
    staleTime: 5 * 60 * 1000,       // 5 minuti
    gcTime: 10 * 60 * 1000,          // 10 minuti
});
```

### usePostUser (cache update manuale)

```tsx
// src/features/user/api/usePostUser.ts
return useMutation({
    mutationKey: [QUERY_KEY_STRINGS.USER.CREATE],
    mutationFn: doPostUser,
    onSuccess: (newUser) => {
        // AGGIORNAMENTO OTTIMISTICO: invece di invalidare, inserisce manualmente
        queryClient.setQueryData(
            [QUERY_KEY_STRINGS.USER.LIST],
            (oldData: IUserProfile[] | undefined) => {
                if (!oldData) return [newUser];
                return [newUser, ...oldData];
            }
        );
    }
});
```

Questo pattern evita un round-trip al server dopo la creazione, inserendo direttamente il nuovo elemento nella cache.

---

## 5. Cache Invalidation

### 5.1 Gerarchia delle Query Keys

Le query keys seguono una convenzione precisa:

```
Panel API factory:
  [queryKey, 'LIST']                  → GET /entity
  [queryKey, 'LIST', { filters }]     → GET /entity?name=...
  [queryKey, 'DETAIL', id]            → GET /entity/:id
  [queryKey, 'DETAIL', id, extra]     → GET /entity/:id?include=...

Hook manuali:
  [QUERY_KEY_STRINGS.USER.WHOAMI]     → GET /api/whoami
  [QUERY_KEY_STRINGS.USER.LIST, type] → GET /backoffice/user/all?type=...
```

### 5.2 Invalidazione Automatica (pannelli)

Quando un pannello esegue `usePost`, `usePut` o `useDelete`, la factory invalida automaticamente:

| Mutazione | Query invalidate |
|-----------|-----------------|
| `usePost` | `[queryKey, 'LIST']` |
| `usePut` | `[queryKey, 'LIST']` + `[queryKey, 'DETAIL', id]` |
| `useDelete` | `[queryKey, 'LIST']` |

### 5.3 Invalidazione Extra (cross-feature)

Tramite `ApiOptions.invalidateQueries`, una mutazione può invalidare query keys **di altre feature**:

```tsx
// Dopo aver creato un movimento di magazzino, aggiorna anche il lotto
const { mutateAsync: createMovement } = usePost({
    invalidateQueries: ["BATCH", "DETAIL", batchId]   // key completa
});
```

Questo è necessario perché le query keys sono strutturate come array e `invalidateQueries` può specificare qualsiasi key, non solo prefissi.

### 5.4 Invalidazione su Login/Logout

```tsx
// Login → invalida whoami (forza refetch)
usePostLogin().onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["getWhoAmI"] });
};

// Logout → resetta TUTTA la cache
usePostLogout().onSuccess = () => {
    queryClient.clear();   // cancella ogni dato cached
};
```

### 5.5 Aggiornamento Ottimistico (setQueryData)

Usato per evitare round-trip quando si creano entità che appaiono in liste gestite manualmente:

```tsx
queryClient.setQueryData(
    [QUERY_KEY_STRINGS.USER.LIST],
    (oldData) => [newUser, ...(oldData ?? [])]
);
```

### 5.6 Resetta Cache Manuale

`queryClient.clear()` — usato al logout per cancellare **tutti** i dati cached e le query attive.

---

## 6. Comunicazione Cross-Pannello via Cache

### Il pattern `LAST_CREATED`

Quando un pannello **flottante** (callable) crea una nuova entità, il risultato viene comunicato al pannello **chiamante** attraverso la cache di React Query.

```
┌─────────────────────┐          ┌──────────────────────────┐
│   Pannello Ordine   │          │  Pannello Flottante      │
│                     │          │  (es. Seleziona Contatto) │
│  [Seleziona         │          │                           │
│   Contatto]────┐    │          │  Crea Contatto "Rossi"   │
│                │    │          │  → usePost → success     │
│                │    │          │  → onSuccess(id)         │
│                │    │          │  → queryClient.setQuery( │
│                │    │          │      ['LAST_CREATED',    │
│                │    │          │       'contacts'], id)   │
│                │    │          └──────────┬───────────────┘
│                │    │                     │
│                ▼    │                     │
│  useSubscribePanel  │◄────────────────────┘
│  { formKey:         │   event.type === 'updated'
│    "contactId",     │   && queryKey[0] === 'LAST_CREATED'
│    dependencyKey:   │   && queryKey[1] === 'contacts'
│    "contacts" }     │
│                     │
│  setValue(          │
│    "contactId",     │
│    lastId)          │
└─────────────────────┘
```

#### useCallablePanel (mittente)

**File:** `src/shared/ui/panel/useCallablePanel.ts`

```tsx
const add = ({ initialValue, menu, extra, customId, size }) => {
    addPanel({
        id: "floating:" + uuid,
        component: menu.component,
        title: t(menu.i18nKey),
        floating: { width: 900, height: 800, x: 100 + offset, y: 10 + offset },
        params: {
            initialName: initialValue,
            onSuccess: (id: number) => {
                // 👇 Scrive nella cache React Query
                queryClient.setQueryData(['LAST_CREATED', menu.component], id);
            },
            extra
        }
    }, { overrideLogic: true });
};
```

#### useSubscribePanel (destinatario)

**File:** `src/shared/ui/panel/useSubscribePanel.ts`

```tsx
const useSubscribePanel = <T extends FieldValues>(
    { formKey, dependencyKey, isMulti = false }: ISubscribeProps<T>
) => {
    const queryClient = useQueryClient();
    const { setValue, getValues } = useFormContext<T>();

    useEffect(() => {
        const queryKey = ['LAST_CREATED', dependencyKey];

        const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
            if (event.type === 'updated'
                && event.query.queryKey[0] === 'LAST_CREATED'
                && event.query.queryKey[1] === dependencyKey
            ) {
                const lastId = queryClient.getQueryData<number>(queryKey);
                if (lastId) {
                    // Per select singola:
                    setValue(formKey, lastId, { shouldValidate: true, shouldDirty: true });
                    // Per multi-select (es. "1,2,3"):
                    if (isMulti) { /* appende alla stringa esistente */ }
                    // Resetta per evitare reazioni multiple
                    queryClient.setQueryData(queryKey, null);
                }
            }
        });

        return () => unsubscribe();
    }, [queryClient, setValue, getValues, formKey, dependencyKey, isMulti]);
};
```

**Casi d'uso:**
- Aprire una lista contatti da un form ordine → seleziona/crea contatto → torna al form ordine con l'ID popolato
- Aprire una lista pelli da un form lotto → seleziona/crea pelle → torna al form lotto

---

## 7. QueryKeyStrings

**File:** `src/shared/api/QueryKeyStrings.ts`

Centralizza le query key per feature non coperte dalla factory dei pannelli.

```tsx
const QUERY_KEY_STRINGS = {
    USER: {
        WHOAMI: "getWhoAmI",
        LOGIN: "login",
        LOGIN_OTP: "loginOTP",
        CHANGE_PASSWORD: "changePassword",
        VERIFY_DEVICE: "verifyDevice",
        LOGOUT: "logout",
        CONFIRM_ACCOUNT: "confirmAccount",
        RESET_PASSWORD_REQUEST_CODE: "resetPasswordRequestCode",
        RESET_PASSWORD_VERIFY_CODE: "resetPasswordVerifyCode",
        RESET_PASSWORD_UPDATE: "resetPasswordUpdate",
        REGISTER: "register",
        // CRUD manuali
        LIST: "getUsers",
        CREATE: "createUser",
        DELETE: "deleteUser",
        UPDATE: "updateUser",
        DETAIL: "getUserDetail",
        PROFILE: "getProfile",
    },
    ROLE: {
        CREATE: "createRole",
        DELETE: "deleteRole",
        LIST: "getRoleList",
    }
};
```

**Nota:** Le query key della factory dei pannelli (es. `"CARRIER"`, `"BATCH"`, `"CONTACT"`) sono stringhe libere passate al momento della creazione dell'API, **non** centralizzate in `QueryKeyStrings`. Questo perché ogni pannello definisce la propria key in modo indipendente.

---

## 8. DevTools e API

### Feature Flag (dev)

I dev tools espongono flag che influenzano il comportamento delle API:

| Flag | Effetto | Implementazione |
|------|---------|-----------------|
| `skipAuth` | Salta whoami, usa mockUser | `AuthContext.tsx:73-81` |
| `skipOtp` | Forza `totp_enabled: true` nella risposta whoami | `devResponseInterceptor.ts:13-21` |
| `apiDelay` | Ritardo artificiale di 5 secondi su ogni risposta | `devResponseInterceptor.ts:11` |

### Mock User

```tsx
// src/shared/dev-tools/mock/UserMock.ts
export const mockUser: IUser = {
    id: 0,
    name: "Mario Rossi",
    email: "mario.rossi@example.com",
    role: "Admin",
    accessControl: [/* tutti i permessi */]
};
```

---

## 9. Pattern di Utilizzo

### Pattern 1: Pannello CRUD standard (con factory)

```tsx
// api/myEntityApi.ts
export const myEntityApi = createPanelApi<IMyEntity>({
    baseEndpoint: "/my-entity",
    queryKey: "MY_ENTITY"
});

// MyEntitiesList.tsx
const { data: items, isLoading } = myEntityApi.useGetList({
    queryParams: { name: filterName }
});

// MyEntitiesForm.tsx
const { useGetDetail, usePost, usePut, useDelete } = myEntityApi;
const { data: entity } = useGetDetail(selectedId);
const { mutateAsync: create } = usePost();
const { mutateAsync: update } = usePut();
const { mutateAsync: remove } = useDelete();
```

### Pattern 2: CRUD manuale (senza factory)

```tsx
// useGetUserList.ts
return useQuery({
    queryKey: [QUERY_KEY_STRINGS.USER.LIST, type],
    queryFn: () => get(url),
    staleTime: 5 * 60 * 1000,
});

// usePostUser.ts — con aggiornamento ottimistico
return useMutation({
    mutationFn: doPostUser,
    onSuccess: (newUser) => {
        queryClient.setQueryData(
            [QUERY_KEY_STRINGS.USER.LIST],
            (old) => [newUser, ...(old ?? [])]
        );
    }
});
```

### Pattern 3: Cross-panel communication

```tsx
// Pannello A (apre pannello B flottante)
const callablePanel = useCallablePanel();
callablePanel.add({
    initialValue: { name: "" },
    menu: { component: "contacts", i18nKey: "menu.contacts" },
});

// Pannello B (form) — si chiude e scrive LAST_CREATED
// usePanelFormLogic chiama onSuccess(entity.id) → useCallablePanel
//   → setQueryData(['LAST_CREATED', 'contacts'], id)

// Pannello A (form) — riceve l'ID
useSubscribePanel({ formKey: "contactId", dependencyKey: "contacts" });
```

### Pattern 4: Mutazione con invalidazione extra

```tsx
// Quando un movimento di magazzino modifica anche il lotto
const { mutateAsync: createMovement } = warehouseMovementApi.usePost({
    invalidateQueries: ["BATCH", "DETAIL", currentBatchId]
});
```

---

## Riepilogo delle Query Keys

```
Factory pannelli:                          Hook manuali:
                                           ─────────────────
  ["CARRIER", "LIST"]                      ["getWhoAmI"]
  ["CARRIER", "LIST", { name: "x" }]      ["getUsers", "backoffice"]
  ["CARRIER", "DETAIL", 5]                 ["getRoleList"]
  ["CARRIER", "CREATE"]                    ["login"]
  ["CARRIER", "UPDATE"]
  ["CARRIER", "DELETE"]                   Cross-pannello:
  ["BATCH", "LIST"]                        ─────────────────
  ["CONTACT", "DETAIL", 3]                 ["LAST_CREATED", "contacts"]
                                           ["LAST_CREATED", "carriers"]
```
