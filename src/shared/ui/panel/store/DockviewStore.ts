import { create } from 'zustand';
import type {AddPanelOptions, DockviewApi, DockviewReadyEvent, Parameters} from 'dockview';

/**
    Dockview store for managing dockview state
 **/

interface DockviewState {
    api: DockviewApi | null;
    addPanel: <T extends object = Parameters>(config: AddPanelOptions<T>) => void;
    handleReady: (event: DockviewReadyEvent) => void;
}

export const useDockviewStore = create<DockviewState>((set, get) => ({
    api: null,

    // Handle dockview ready event
    handleReady: (event) => {
        set({ api: event.api });
    },

    // Add a new panel to the dockview
    addPanel: (config) => {
        const { api } = get();
        if (api) {
            api.addPanel(config);
        }
    },
}));
