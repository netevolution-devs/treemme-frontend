import {
  createContext, type ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";
import {useStore} from "zustand/react";
import type {TPanelKind} from "@features/panels/PanelRegistry";
import {
  createPanelStore,
  type PanelActions,
  type PanelState,
} from "@ui/panel/store/PanelStore";

/**
 * Typed Zustand panel store.
 *
 *  F = filter type (e.g. `{ status: string; from?: Date }`)
 *  U = UI‑state type (e.g. `{ collapsed: boolean }`)
 */
export type PanelStore<F, U> = ReturnType<typeof createPanelStore<F, U>>;

/**
 * Context value: panel metadata + typed store.
 */
interface PanelContextValue<F, U> {
  kind: TPanelKind;
  uuid: string;
  panelId: string;
  store: PanelStore<F, U>;
}

/**
 * React context – defaults to `null` (used for the safety check).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PanelContext = createContext<PanelContextValue<any, any> | null>(null);

/**
 * Props for the provider.
 *
 *  F = filter type
 *  U = UI‑state type
 */
export interface PanelProviderProps<F, U> {
  kind: TPanelKind;
  /** Optional – generated if missing */
  uuid?: string;
  /** Optional initial state – useful for tests or pre‑population */
  initialState?: Partial<PanelState<F, U>>;
  children: ReactNode;
}

/**
 * Provider that creates **a new store instance** for each panel.
 *
 * It is fully typed: the caller decides which types to use for `F` and `U`.
 * Thanks to generics, `any` no longer appears.
 */
export const PanelProvider = <F, U>({
                                      kind,
                                      uuid: uuidProp,
                                      initialState,
                                      children,
                                    }: PanelProviderProps<F, U>) => {
  const uuid = useMemo(() => uuidProp ?? crypto.randomUUID(), [uuidProp]);

  const panelId = `${kind}:${uuid}`;

  // Create a fresh store for this panel
  const [store] = useState(() => createPanelStore<F, U>(initialState));

  const contextValue = useMemo(
      () => ({
        kind,
        uuid,
        panelId,
        store,
      }),
      [kind, uuid, panelId, store]
  );

  return (
      <PanelContext.Provider value={contextValue}>
        {children}
      </PanelContext.Provider>
  );
};

/**
 * Hook that returns the panel metadata **and** a typed `useStore` helper.
 */
export const usePanel = <F, U>() => {
  const ctx = useContext(PanelContext);

  if (!ctx) {
    throw new Error("usePanel must be used within a PanelProvider");
  }

  const {store, ...meta} = ctx;

  return {
    ...meta,
    /**
     * Typed selector hook for the underlying Zustand store.
     */
    useStore: <Sel, >(
        selector: (state: PanelState<F, U> & PanelActions<F, U>) => Sel,
    ) => {
      return useStore(store, selector);
    },
    store: store as PanelStore<F, U>,
  };
};

/**
 * Hook that returns **only** the panel metadata.
 * It is separated from `usePanel` so the return type is always just the
 * metadata and does not get mixed with the store.
 */
export const usePanelMeta = <F, U>() => {
  const ctx = useContext(
      PanelContext,
  ) as PanelContextValue<F, U> | null;

  if (!ctx) {
    throw new Error("usePanelMeta must be used within a PanelProvider");
  }

  const {kind, uuid, panelId} = ctx;
  return {kind, uuid, panelId};
};
