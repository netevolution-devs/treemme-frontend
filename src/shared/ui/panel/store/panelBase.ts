export type SelectedMap<K extends string = string> = Record<K, string | undefined>;

export interface PanelBase<K extends string = string> {
    type: string;
    selected: SelectedMap<K>;
    setSelected: (key: K, id: string | undefined) => void;
    setManySelected: (entries: Partial<SelectedMap<K>>) => void;
    clearSelected: (key?: K) => void;
}

export type PanelState<F extends object, K extends string = string> = PanelBase<K> & {
    filters: F;
    setFilters: (f: Partial<F>) => void;
    resetFilters: (defaultFilters: F) => void;
};