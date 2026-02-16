import {create, type StoreApi, type UseBoundStore} from 'zustand';
import {immer} from 'zustand/middleware/immer';
import {devtools} from 'zustand/middleware';
import type {PanelState, SelectedMap} from "@ui/panel/store/panelBase.ts";

export const storeCache = new Map<string, UseBoundStore<StoreApi<PanelState<object, string>>>>();

export function getOrCreatePanelStore<F extends object, K extends string = string>(
    kind: string,
    instanceId: string,
    defaultFilters: F,
    defaultSelected: SelectedMap<K> = {} as SelectedMap<K>
): UseBoundStore<StoreApi<PanelState<F, K>>> {
    const cacheKey = `${kind}:${instanceId}`;

    let store = storeCache.get(cacheKey) as UseBoundStore<StoreApi<PanelState<F, K>>> | undefined;

    if (!store) {
        store = create<PanelState<F, K>>()(
            devtools(
                immer((set) => ({
                    type: kind,
                    selected: defaultSelected,
                    filters: defaultFilters,

                    setSelected: (key, id) =>
                        set((state) => {
                            state.selected[key] = id;
                        }),

                    setManySelected: (entries) =>
                        set((state) => {
                            state.selected = { ...state.selected, ...entries } as SelectedMap<K>;
                        }),

                    clearSelected: (key) =>
                        set((state) => {
                            if (key) {
                                delete state.selected[key];
                            } else {
                                state.selected = {} as SelectedMap<K>;
                            }
                        }),

                    setFilters: (partial) =>
                        set((state) => {
                            state.filters = {...state.filters, ...partial};
                        }),

                    resetFilters: (defaults) =>
                        set((state) => {
                            state.filters = defaults;
                        }),
                })),
                {name: `Panel:${cacheKey}`}
            )
        );
        storeCache.set(cacheKey, store as unknown as UseBoundStore<StoreApi<PanelState<object, string>>>);
    }

    return store;
}