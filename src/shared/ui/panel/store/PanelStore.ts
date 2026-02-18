import {createStore} from "zustand";

export interface PanelState<F, U> {
    filters: F;
    uiState: U;
    isLoading: boolean;
    error: string | null;
}

export interface PanelActions<F, U> {
    setFilters: (partial: Partial<F>) => void;
    setUIState: (partial: Partial<U>) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;

    reset: () => void;
}

export const getDefaultPanelState = <F, U>(): PanelState<F, U> => ({
    filters: {} as F,
    uiState: {} as U,
    isLoading: false,
    error: null,
});

export const createPanelStore = <F, U>(
  initialState?: Partial<PanelState<F, U>>
) => {
    const defaultState = getDefaultPanelState<F, U>();
    const merged = { ...defaultState, ...initialState };

    return createStore<PanelState<F, U> & PanelActions<F, U>>((set) => ({
        ...merged,

        setFilters: (partial) =>
          set((s) => ({
              filters: { ...s?.filters, ...partial } as F,
          })),

        setUIState: (partial) =>
          set((s) => ({
              uiState: { ...s.uiState, ...partial } as U,
          })),

        setLoading: (loading) =>
          set(() => ({ isLoading: loading })),

        setError: (error) =>
          set(() => ({ error })),

        reset: () => set(() => ({ ...defaultState })),
    }));
};
