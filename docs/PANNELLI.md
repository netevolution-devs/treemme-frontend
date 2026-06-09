# Architettura dei Pannelli Dockview

> Guida completa all'architettura, implementazione e creazione di nuovi pannelli.

---

## Indice

1. [Introduzione](#1-introduzione)
2. [Architettura Generale](#2-architettura-generale)
3. [Componenti Core](#3-componenti-core)
   - [Panel Registry](#31-panel-registry)
   - [GenericPanel](#32-genericpanel)
   - [GenericList](#33-genericlist)
   - [GenericForm](#34-genericform)
   - [FormButtons](#35-formbuttons)
   - [PanelStore / PanelContext](#36-panelstore--panelcontext)
   - [DockviewStore](#37-dockviewstore)
   - [Panel API Factory](#38-panel-api-factory)
   - [useCallablePanel](#39-usecallablepanel)
4. [Flusso di Esecuzione Completo](#4-flusso-di-esecuzione-completo)
5. [Guida alla Creazione di un Nuovo Pannello](#5-guida-alla-creazione-di-un-nuovo-pannello)
   - [Step 1: Struttura file](#step-1-struttura-file)
   - [Step 2: Interfaccia entità](#step-2-interfaccia-entità)
   - [Step 3: Factory API](#step-3-factory-api)
   - [Step 4: Panel (root)](#step-4-panel-root)
   - [Step 5: Lista](#step-5-lista)
   - [Step 6: Form](#step-6-form)
   - [Step 7: Registrazione](#step-7-registrazione)
   - [Step 8: Menu](#step-8-menu)
   - [Step 9: Traduzioni](#step-9-traduzioni)
6. [Pattern Avanzati](#6-pattern-avanzati)
   - [Aggiungere Filtri](#aggiungere-filtri)
   - [Pannelli con Tab Multiple](#pannelli-con-tab-multiple)
   - [Pannelli Flottanti / Callable](#pannelli-flottanti--callable)
   - [Pulsanti Extra nella Form](#pulsanti-extra-nella-form)
   - [Comunicazione tra Pannelli](#comunicazione-tra-pannelli)

---

## 1. Introduzione

Il workspace dell'applicazione è basato su **Dockview** (`dockview` v5), una libreria che implementa un'interfaccia MDI (Multiple Document Interface) a tab. Ogni entità gestionale (anagrafiche, lotti, ordini, prodotti, ecc.) vive in un **pannello** indipendente che può essere aperto, chiuso, spostato e organizzato in gruppi di tab.

L'architettura dei pannelli è costruita su 3 componenti generici riusabili (`GenericPanel`, `GenericList`, `GenericForm`) che eliminano la ripetizione di codice per le operazioni CRUD standard.

---

## 2. Architettura Generale

```
┌─────────────────────────────────────────────────────────────────┐
│                     MenuToolbar (AppBar)                        │
│  ┌─────────┐ ┌──────────┐ ┌──────────┐ ┌──────┐ ┌──────────┐  │
│  │ Contatti │ │Produzione│ │  Ordini  │ │ ...  │ │ Impost.  │  │
│  └─────────┘ └──────────┘ └──────────┘ └──────┘ └──────────┘  │
└─────────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────────┐
│  DockviewReact (PanelContainerPage)                             │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ ┌───────┐ ┌───────────┐ ┌─────────────┐                │    │
│  │ │Lotti  │ │Trasport. │ │Anagrafiche  │   ← tab group   │    │
│  │ │       │ │           │ │             │                │    │
│  │ │       │ │           │ │             │                │    │
│  │ └───────┘ └───────────┘ └─────────────┘                │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘

Ogni pannello dockview:
┌─────────────────────────────────────────────────────────────────┐
│  GenericPanel<F, U>                                              │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  GenericList<T> (material-react-table)                  │    │
│  │  ┌──────────────────────────────────────────────────┐   │    │
│  │  │ ID │ Nome          │ Descrizione         │ Azioni │   │    │
│  │  ├────┼────────────────┼──────────────────────┼───────┤   │    │
│  │  │ 1  │ Trasp. Rossi  │ ...                  │       │   │    │
│  │  │ 2  │ Trasp. Bianchi│ ...                  │       │   │    │
│  │  │ 3  │ Trasp. Verdi  │ ...                  │       │   │    │
│  │  └────┴────────────────┴──────────────────────┴───────┘   │    │
│  ├─────────────────────────────────────────────────────────┤    │
│  │  GenericForm<TForm, TEntity>                              │    │
│  │  ┌──────────────────────────────────────────────────┐   │    │
│  │  │ [Nuovo] [Modifica] [Elimina] [Annulla] [Salva]  │   │    │
│  │  ├──────────────────────────────────────────────────┤   │    │
│  │  │ Nome:    [________________________]             │   │    │
│  │  │ Desc:    [________________________]             │   │    │
│  │  └──────────────────────────────────────────────────┘   │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Componenti Core

### 3.1 Panel Registry

**File:** `src/features/panels/PanelRegistry.tsx`

Registro centrale che mappa ogni `TPanelKind` (stringa identificativa) al componente React corrispondente.

```tsx
// Ogni nuova tipologia di pannello va aggiunta qui
type TPanelKind = 'contacts' | 'agents' | 'batches' | 'carriers'
                | 'cap' | 'users' | 'settings' | 'not-implemented'
                | /* ... altri ~50 tipi ... */;

const PANEL_REGISTRY: DockviewComponents = {
    contacts:   (props) => <ContactsPanel {...props}/>,
    carriers:   (props) => <CarriersPanel {...props}/>,
    batches:    (props) => <BatchesPanel {...props}/>,
    users:      (props) => <UsersPanel {...props}/>,
    // ...
};
```

Il registry viene passato come prop `components` al `<DockviewReact>` in `PanelContainerPage.tsx`.

### 3.2 GenericPanel

**File:** `src/features/panels/shared/GenericPanel.tsx`

Layout wrapper che:
1. Crea un **`PanelProvider`** (contesto React + store Zustand) per l'istanza del pannello
2. Dispone la lista in alto e il form in basso in un flex column
3. Applica lo sfondo `background.panel` del tema

```tsx
interface GenericPanelProps<F, U> {
    kind: TPanelKind;
    uuid?: string;
    initialState: Partial<PanelState<F, U>>;
    children?: ReactNode;         // Il form
    listComponent?: ReactNode;    // La lista
    disableBorders?: boolean;
}
```

### 3.3 GenericList

**File:** `src/features/panels/shared/GenericList.tsx`

Wrapper su `material-react-table` (`MaterialReactTable`).

```tsx
interface GenericListProps<TData extends BaseEntity> {
    data: TData[];
    isLoading: boolean;
    isFetching?: boolean;
    columns: MRT_ColumnDef<TData>[];
    selectedId?: string | number | null;
    onRowSelect?: (id: TData["id"]) => void;
    onRowDoubleClick?: (id: TData["id"]) => void;
    maxHeight?: string;           // default '300px'
    minHeight?: string;           // default '300px'
    disableBorder?: boolean;
    additionalOptions?: Partial<MRT_TableOptions<TData>>;
    overrideOptions?: Partial<MRT_TableOptions<TData>>;
}
```

- Click riga → `onRowSelect(id)`
- Doppio click → `onRowDoubleClick(id)`
- Mostra spinner durante `isFetching`
- Virtualizzazione automatica se `data.length > 50`

### 3.4 GenericForm

**File:** `src/features/panels/shared/GenericForm.tsx`

Componente più complesso. Orchestra l'intero ciclo di vita CRUD con:

- **react-hook-form** (`FormProvider`) per la gestione dei campi
- **Macchina a stati** per i pulsanti (init → new/edit → selected → cancel)
- **Permessi** tramite prop `resource`
- **Keyboard shortcut**: F4=Modifica, F9=Nuovo, F10=Salva, Esc=Annulla
- **Dialoghi di conferma** per salvataggio ed eliminazione

```tsx
interface GenericFormProps<TForm extends FieldValues, TEntity, /* opzionale */> {
    // Stato
    selectedId: number | null | undefined;
    entity?: TEntity | null | undefined;
    emptyValues: TForm;
    mapEntityToForm: (entity: TEntity) => TForm;

    // Azioni CRUD
    create?: (payload: TForm) => Promise<unknown>;
    update?: (id: number, payload: TForm) => Promise<unknown>;
    remove?: (id: number) => Promise<unknown>;

    // UI
    isSaving?: boolean;
    isDeleting?: boolean;
    onClearSelection?: () => void;
    renderFields: () => React.ReactNode;

    // Permessi
    resource?: ResourceName;

    // Modalità
    dialogMode?: boolean;
    floatingPanelMode?: boolean;

    // Extra
    extraButtons?: ReactNode[];
    bypassConfirm?: boolean;
    closePanelOnSave?: boolean;
    closePanelOnCancel?: boolean;
    // ... altre opzioni
}
```

#### Macchina a Stati dei Pulsanti

```
            ┌─────────┐
            │   init   │  ← stato iniziale (solo Nuovo abilitato)
            └────┬─────┘
                 │
            ┌────▼─────┐
     F9 ───>│   new    │  ← form abilitato, pulsanti: Salva + Annulla
            └────┬─────┘
                 │
            ┌────▼─────┐
     F4 ───>│   edit   │  ← form abilitato, pulsanti: Salva + Annulla
            └────┬─────┘
                 │
            ┌────▼────────┐
   Esc ────>│  selected   │  ← form disabilitato, pulsanti: Modifica + Elimina + Annulla
            └────┬────────┘
                 │
            ┌────▼──────┐
   Esc ────>│  cancel   │  ← torna a init
            └───────────┘
```

#### Keyboard Shortcut

| Tasto | Condizione | Azione |
|-------|-----------|--------|
| **F4** | `selectedId` presente E form disabilitato | Entra in modifica |
| **F9** | Nessun `selectedId` E form disabilitato | Entra in nuovo |
| **F10** | Form abilitato | Salva/Submit |
| **Esc** | Pannello flottante | Chiude il pannello |
| **Esc** | Pannello non flottante | Annulla (resetta form) |

Gli shortcut sono attivi solo sul pannello focalizzato (controllo `activePanelId`).

### 3.5 FormButtons

**File:** `src/features/panels/shared/FormButtons.tsx`

Toolbar dei pulsanti CRUD (Nuovo, Modifica, Elimina, Annulla, Salva, Aggiorna).

```tsx
interface IButtonState {
    new: boolean; edit: boolean; delete: boolean;
    save: boolean; cancel: boolean; update: boolean;
}

// Predefiniti
const BaseButtonState: IButtonState = {      // init: solo new=true
    new: true, edit: false, delete: false,
    save: false, cancel: false, update: false
};
const ButtonStateDisabled: IButtonState = {   // tutto disabilitato
    new: false, edit: false, delete: false,
    save: false, cancel: false, update: false
};
```

Ogni bottone ha icona, label i18n e colore:
- **Nuovo** (AddIcon, `button.new`, primary)
- **Modifica** (EditIcon, `button.edit`, warning)
- **Elimina** (DeleteIcon, `button.delete`, error)
- **Annulla** (CloseIcon, `button.cancel`, inherit)
- **Salva** (SaveIcon, `button.save`, success, type=submit)
- **Aggiorna** (SaveAsIcon, `button.update`, success)

### 3.6 PanelStore / PanelContext

**File:** `src/shared/ui/panel/store/PanelStore.ts` e `src/shared/ui/panel/PanelContext.tsx`

#### PanelStore (Zustand)

Ogni pannello ha un **proprio store Zustand isolato** creato tramite `createPanelStore<F, U>()`.

```tsx
interface PanelState<F, U> {
    filters: F;              // Stato filtri (tipizzato)
    uiState: U;              // Stato UI (selectedId, isFormDisabled, buttonsState)
    isLoading: boolean;
    error: string | null;
}

interface PanelActions<F, U> {
    setFilters: (partial: Partial<F>) => void;
    setUIState: (partial: Partial<U>) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    reset: () => void;
}
```

I generics `F` (filters) e `U` (UI state) permettono a ogni pannello di definire il proprio shape.

#### PanelContext

Il `PanelProvider` crea lo store per l'istanza e lo fornisce via React context.

```tsx
// Nel pannello:
const { useStore, store } = usePanel<F, U>();
const selectedId = useStore(state => state.uiState.selectedId);
const setUIState = useStore(state => state.setUIState);

// setUIState esegue un merge parziale (immer):
setUIState({ selectedId: 5 });
```

### 3.7 DockviewStore

**File:** `src/shared/ui/panel/store/DockviewStore.ts`

Store **globale** (singleton Zustand) che gestisce l'API di dockview.

```tsx
interface DockviewState {
    api: DockviewApi | null;
    activePanelId: string | null;
    addPanel: (config, extraConf?) => void;
    handleReady: (event: DockviewReadyEvent) => void;
    setActivePanelId: (id) => void;
}
```

**`addPanel`:** Se un pannello con lo stesso `component` esiste già, lo focus (evita duplicati). Se `overrideLogic=true` (pannelli flottanti), crea sempre una nuova istanza.

### 3.8 Panel API Factory

**File:** `src/features/panels/shared/hooks/createPanelApiFactory.ts`

Factory che genera 5 hook TanStack Query per un endpoint REST.

```tsx
const api = createPanelApi<TEntity>({
    baseEndpoint: "/shipping-carrier",  // Endpoint base
    queryKey: "CARRIER"                 // Chiave cache
});

// Hook generati:
api.useGetList(options?)         → GET  /shipping-carrier
api.useGetDetail(id?)            → GET  /shipping-carrier/:id
api.usePost(options?)            → POST /shipping-carrier
api.usePut(options?)             → PUT  /shipping-carrier/:id
api.useDelete(options?)          → DELETE /shipping-carrier/:id
```

**Configurazioni:**
- `staleTime: Infinity`, `gcTime: Infinity` per le liste (cached indefinitamente)
- `staleTime: 0` per i dettagli (sempre rifetched)
- Le mutazioni invalidano automaticamente la lista (`[queryKey, 'LIST']`)
- `ApiOptions.queryParams` per parametri query nella GET list
- `ApiOptions.invalidateQueries` per query keys aggiuntive da invalidare

### 3.9 useCallablePanel

**File:** `src/shared/ui/panel/useCallablePanel.ts`

Hook per aprire pannelli **flottanti** (popup dockview) da qualsiasi punto dell'app.

```tsx
const callablePanel = useCallablePanel();

callablePanel.add({
    initialValue: { name: "Nuovo elemento" },
    menu: { component: "contacts", i18nKey: "menu.contacts.contacts" },
    extra: { /* dati extra */ },
    size: { width: 600, height: 500 }
});
```

Apre un pannello flottante con posizione a cascata (offset progressivo fino a 6 istanze).

---

## 4. Flusso di Esecuzione Completo

```
1. Utente clicca voce di menu
   │
   ▼
2. MenuToolbar.handlePanelOpen(menu)
   │  Chiama useDockviewStore.addPanel()
   │  { id: "batches:uuid", title: t("menu.batches"), component: "batches" }
   ▼
3. DockviewStore.addPanel()
   │  Controlla se esiste già un pannello "batches"
   │  ● Se sì: focus e aggiorna parametri
   │  ● Se no: api.addPanel(config)
   ▼
4. DockviewReact
   │  Cerca il componente in PANEL_REGISTRY["batches"]
   │  Rende <BatchesPanel {...props}/>
   ▼
5. BatchesPanel.tsx
   │  Rende GenericPanel<F, U>
   │    ├── PanelProvider (crea store Zustand per questa istanza)
   │    ├── BatchesList
   │    │    ├── batchApi.useGetList()  ← TanStack Query
   │    │    └── GenericList<IBatch>
   │    └── BatchesForm
   │         ├── batchApi.useGetDetail(selectedId)  ← dettaglio
   │         ├── batchApi.usePost/usePut/useDelete   ← mutazioni
   │         └── GenericForm<IBatchForm, IBatch>
   ▼
6. Ciclo interazione utente
   │  F9 → Nuovo → compila campi → Salva → usePost
   │  Click riga → selectedId → useGetDetail → F4 → Modifica → Salva → usePut
   │  Click riga → Elimina → conferma → useDelete
```

---

## 5. Guida alla Creazione di un Nuovo Pannello

> Crea un pannello "MyEntities" in `src/features/panels/[categoria]/my-entities/`

### Step 1: Struttura file

```
src/features/panels/[categoria]/my-entities/
├── api/
│   ├── IMyEntity.ts            # Interfaccia dati
│   └── myEntityApi.ts          # Factory API hooks
├── MyEntitiesPanel.tsx         # Composition root
├── MyEntitiesList.tsx          # Lista tabella
└── MyEntitiesForm.tsx          # Form CRUD
```

### Step 2: Interfaccia entità

```tsx
// api/IMyEntity.ts
export interface IMyEntity {
    id: number;
    name: string;
    description?: string;
    codice?: string;
    isActive?: boolean;
}
```

### Step 3: Factory API

```tsx
// api/myEntityApi.ts
import { createPanelApi }
    from "@features/panels/shared/hooks/createPanelApiFactory";
import type { IMyEntity } from "./IMyEntity";

export const myEntityApi = createPanelApi<IMyEntity>({
    baseEndpoint: "/my-entity",
    queryKey: "MY_ENTITY"
});
```

### Step 4: Panel (root)

```tsx
// MyEntitiesPanel.tsx
import GenericPanel from "@features/panels/shared/GenericPanel";
import { BaseButtonState } from "@features/panels/shared/FormButtons";
import type { IPanelUIState }
    from "@features/panels/shared/hooks/usePanelFormButtons";
import MyEntitiesList from "./MyEntitiesList";
import MyEntitiesForm from "./MyEntitiesForm";
import type { IDockviewPanelProps } from "dockview";
import type { ICustomPanelProps }
    from "@ui/panel/store/ICustomPanelPropst";

export interface IMyEntitiesUIState extends IPanelUIState {
    selectedEntityId?: number | null;
}

const MyEntitiesPanel = (props: IDockviewPanelProps<ICustomPanelProps>) => {
    const initialUI: IMyEntitiesUIState = {
        isFormDisabled: true,
        buttonsState: BaseButtonState,
    };

    return (
        <GenericPanel<unknown, IMyEntitiesUIState>
            kind={"myEntities"}
            uuid={props.api.id}
            initialState={{ uiState: initialUI }}
            listComponent={<MyEntitiesList />}
        >
            <MyEntitiesForm {...props.params} />
        </GenericPanel>
    );
};

export default MyEntitiesPanel;
```

### Step 5: Lista

```tsx
// MyEntitiesList.tsx
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { MRT_ColumnDef } from "material-react-table";
import { usePanel } from "@ui/panel/PanelContext";
import GenericList from "@features/panels/shared/GenericList";
import { myEntityApi } from "./api/myEntityApi";
import type { IMyEntity } from "./api/IMyEntity";
import type { IMyEntitiesUIState } from "./MyEntitiesPanel";

const MyEntitiesList = () => {
    const { t } = useTranslation(["form"]);
    const { useStore } = usePanel<unknown, IMyEntitiesUIState>();
    const selectedId = useStore(s => s.uiState.selectedEntityId);
    const setUIState = useStore(s => s.setUIState);

    const { data: items = [], isLoading, isFetching } = myEntityApi.useGetList();

    const columns = useMemo<MRT_ColumnDef<IMyEntity>[]>(() => [
        { accessorKey: "name", header: t("myEntity.name"), size: 200 },
        { accessorKey: "description", header: t("myEntity.description"), size: 300 },
        { accessorKey: "codice", header: t("myEntity.codice"), size: 100 },
    ], [t]);

    return (
        <GenericList<IMyEntity>
            data={items}
            isLoading={isLoading}
            isFetching={isFetching}
            columns={columns}
            selectedId={selectedId}
            onRowSelect={(id) => setUIState({ selectedEntityId: id })}
        />
    );
};

export default MyEntitiesList;
```

### Step 6: Form

```tsx
// MyEntitiesForm.tsx
import { useTranslation } from "react-i18next";
import { usePanel } from "@ui/panel/PanelContext";
import GenericForm from "@features/panels/shared/GenericForm";
import { usePanelFormButtons }
    from "@features/panels/shared/hooks/usePanelFormButtons";
import { usePanelFormLogic }
    from "@ui/panel/usePanelFormLogin";
import TextFieldControlled from "@ui/form/controlled/TextFieldControlled";
import { myEntityApi } from "./api/myEntityApi";
import type { IMyEntity } from "./api/IMyEntity";
import type { IMyEntitiesUIState } from "./MyEntitiesPanel";
import type { ICustomPanelFormProps }
    from "@ui/panel/store/ICustomPanelPropst";

export type IMyEntityForm = Omit<IMyEntity, "id">;

const MyEntitiesForm = ({ initialName, onSuccess }: ICustomPanelFormProps) => {
    const { t } = useTranslation(["form"]);
    const { useStore } = usePanel<unknown, IMyEntitiesUIState>();
    const selectedId = useStore(s => s.uiState.selectedEntityId);
    const setUIState = useStore(s => s.setUIState);

    const { setFormState } = usePanelFormButtons();
    const { handlePanelSuccess } = usePanelFormLogic({
        initialName, selectedId, onSuccess, setFormState,
    });

    const { useGetDetail, usePost, usePut, useDelete } = myEntityApi;
    const { data: entity } = useGetDetail(selectedId);
    const { mutateAsync: create, isPending: isPosting } = usePost();
    const { mutateAsync: update, isPending: isPutting } = usePut();
    const { mutateAsync: remove, isPending: isDeleting } = useDelete();

    return (
        <GenericForm<IMyEntityForm, IMyEntity, IMyEntitiesUIState>
            resource="my-feature - my-entities"
            selectedId={selectedId}
            entity={entity}
            emptyValues={{
                name: initialName ?? "",
                description: "",
                codice: "",
            }}
            mapEntityToForm={(e) => ({
                name: e.name,
                description: e.description ?? "",
                codice: e.codice ?? "",
            })}
            create={(p) => create(p)}
            update={(id, p) => update({ id, payload: p })}
            remove={(id) => remove(id)}
            isSaving={isPosting || isPutting}
            isDeleting={isDeleting}
            onClearSelection={() => setUIState({ selectedEntityId: null })}
            onSuccess={handlePanelSuccess}
            renderFields={() => (
                <>
                    <TextFieldControlled<IMyEntityForm>
                        name="name"
                        label={t("myEntity.name")}
                        required
                    />
                    <TextFieldControlled<IMyEntityForm>
                        name="codice"
                        label={t("myEntity.codice")}
                    />
                    <TextFieldControlled<IMyEntityForm>
                        name="description"
                        label={t("myEntity.description")}
                        multiline
                        rows={3}
                    />
                </>
            )}
        />
    );
};

export default MyEntitiesForm;
```

### Step 7: Registrazione

In `src/features/panels/PanelRegistry.tsx`:

```tsx
// 1. Import
import MyEntitiesPanel from "@features/panels/[categoria]/my-entities/MyEntitiesPanel";

// 2. Aggiungi il tipo (nella union TPanelKind)
type TPanelKind = /* ... | */ 'myEntities' /* | ... */;

// 3. Aggiungi al registry
const PANEL_REGISTRY: DockviewComponents = {
    /* ... */
    myEntities: (props) => <MyEntitiesPanel {...props} />,
};
```

### Step 8: Menu

In `src/shared/ui/layout/menu/MenuEntries.ts`:

```tsx
{
    i18nKey: "menu.my-section.my-entities",
    component: "myEntities",
    permissionCheck: { resource: "my-feature - my-entities", action: "get" },
},
```

### Step 9: Traduzioni

In `public/locales/it/form.json`:

```json
{
    "myEntity.name": "Nome",
    "myEntity.description": "Descrizione",
    "myEntity.codice": "Codice"
}
```

In `public/locales/it/menu.json`:

```json
{
    "my-section.my-entities": "My Entities"
}
```

---

## 6. Pattern Avanzati

### Aggiungere Filtri

Se la lista ha bisogno di filtri, si definisce un'interfaccia `F` e si passa al GenericPanel.

```tsx
// Interfaccia filtri
export interface IMyEntitiesFilter {
    filterName?: string;
    filterIsActive?: boolean;
}

// Panel
<GenericPanel<IMyEntitiesFilter, IMyEntitiesUIState>
    kind={"myEntities"}
    initialState={{
        filters: {} as IMyEntitiesFilter,
        uiState: initialUI,
    }}
    listComponent={<MyEntitiesList />}
>
    <MyEntitiesForm />
</GenericPanel>

// Lista con filtri
import ListToolbar from "@features/panels/shared/ListToolbar";
import TextFieldFilter from "@ui/form/filters/TextFieldFilter";

const MyEntitiesList = () => {
    const { useStore } = usePanel<IMyEntitiesFilter, IMyEntitiesUIState>();
    const filters = useStore(s => s.filters);
    const setFilters = useStore(s => s.setFilters);

    const { data } = myEntityApi.useGetList({
        queryParams: { name: filters.filterName }
    });

    return (
        <GenericList<IMyEntity>
            data={data ?? []}
            /* ... */
            overrideOptions={{
                renderTopToolbar: () => (
                    <ListToolbar
                        filters={[
                            <TextFieldFilter
                                key="name"
                                label={t("myEntity.name")}
                                value={filters.filterName}
                                onFilterChange={(v) =>
                                    setFilters({ filterName: v as string })}
                            />,
                        ]}
                    />
                ),
            }}
        />
    );
};
```

### Pannelli con Tab Multiple

Per pannelli complessi (es. Lotti), si usa `GenericTabContent`.

```tsx
// MyEntitiesPanel.tsx — con tab
import GenericTabContent from "@features/panels/shared/GenericTabContent";

const MyEntitiesPanel = (props: IDockviewPanelProps<ICustomPanelProps>) => {
    const [tabIndex, setTabIndex] = useState(0);

    return (
        <GenericPanel<F, U>
            kind={"myEntities"}
            /* ... */
        >
            <GenericTabContent
                value={tabIndex}
                onChange={(_, v) => setTabIndex(v)}
                tabs={[
                    { label: "Dettaglio", component: <MyEntitiesForm /> },
                    { label: "Storico", component: <MyEntitiesHistory /> },
                    { label: "Documenti", component: <MyEntitiesDocs /> },
                ]}
            />
        </GenericPanel>
    );
};
```

### Pannelli Flottanti / Callable

Per aprire un pannello popup (es. selezione fornitore da dentro un form lotto):

```tsx
import { useCallablePanel } from "@ui/panel/useCallablePanel";

const MyForm = () => {
    const callablePanel = useCallablePanel();

    const handleOpenCarrierSelect = () => {
        callablePanel.add({
            initialValue: { name: "" },
            menu: { component: "carriers", i18nKey: "menu.contacts.carriers" },
            size: { width: 600, height: 500 },
        });
    };

    return (
        <>
            <TextFieldControlled name="carrierName" label="Trasportatore" />
            <Button onClick={handleOpenCarrierSelect}>Seleziona</Button>
        </>
    );
};
```

Nel form del pannello chiamato (CarriersForm):

```tsx
const CarriersForm = ({ initialName, onSuccess }: ICustomPanelFormProps) => {
    const { handlePanelSuccess } = usePanelFormLogic({
        initialName, selectedId, onSuccess, setFormState,
    });

    return (
        <GenericForm
            /* ... */
            onSuccess={handlePanelSuccess}
            closePanelOnSave={true}
            floatingPanelMode={true}
        />
    );
};
```

### Pulsanti Extra nella Form

```tsx
<GenericForm
    /* ... */
    extraButtons={[
        <Button key="print" onClick={handlePrint}>Stampa</Button>,
        <Button key="history" onClick={handleShowHistory}>Storico</Button>,
    ]}
/>
```

### Comunicazione tra Pannelli

Usando la React Query cache:

```tsx
// Nel pannello che CREA un'entità (es. carriers):
// useCallablePanel.add() passa onSuccess che scrive LAST_CREATED

// Nel pannello che DEVE RICEVERE l'entità creata:
import { useSubscribePanel } from "@ui/panel/useSubscribePanel";

const MyForm = () => {
    // Auto-seleziona il corriere appena creato nel pannello flottante
    useSubscribePanel({
        componentName: "carriers",
        onCreated: (id) => setUIState({ selectedCarrierId: id }),
    });
};
```

---

## Riepilogo Pattern

| Pattern | Descrizione |
|---------|-------------|
| **Panel Pattern** | `Panel.tsx` → `GenericPanel` + `List` + `Form` |
| **API Pattern** | `createPanelApi<T>(config)` genera 5 hook Query |
| **State Pattern** | Store Zustand per-pannello con `filters` + `uiState` generics |
| **Button State** | `usePanelFormButtons` controlla form + bottoni |
| **Permessi** | Prop `resource` su `GenericForm`, verificato via `permissionEngine` |
| **Floating Panels** | `useCallablePanel().add()` apre popup dockview |
| **Cross-Panel** | `useSubscribePanel` ascolta eventi `LAST_CREATED` cache |
| **Keyboard** | F4=Edit, F9=New, F10=Save, Esc=Cancel/Close |
