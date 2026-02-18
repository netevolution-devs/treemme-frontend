import {createStore} from "zustand";

export interface PanelState<F, U> {
    filters: F;
    uiState: U;
    isLoading: boolean;
    error: string | null;
}

export interface PanelActions<F, U> {
    setFilters: (filters: F) => void;
    updateFilters: (partial: Partial<F>) => void;

    setUIState: (ui: U) => void;
    updateUIState: (partial: Partial<U>) => void;

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

        setFilters: (filters) =>
          set(() => ({ filters })),

        updateFilters: (partial) =>
          set((s) => ({
              filters: { ...s?.filters, ...partial } as F,
          })),

        setUIState: (ui) =>
          set(() => ({ uiState: ui })),

        updateUIState: (partial) =>
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
