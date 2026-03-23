import { create } from 'zustand';
import type {AddPanelOptions, DockviewApi, DockviewReadyEvent, Parameters} from 'dockview';

/**
    Dockview store for managing dockview state
 **/

interface DockviewState {
    api: DockviewApi | null;
    activePanelId: string | null;
    addPanel: <T extends object = Parameters>(config: AddPanelOptions<T>) => void;
    handleReady: (event: DockviewReadyEvent) => void;
    setActivePanelId: (id: string | null) => void;
}

export const useDockviewStore = create<DockviewState>((set, get) => ({
    api: null,
    activePanelId: null,

    // Handle dockview ready event
    handleReady: (event) => {
        set({ api: event.api });

        // Update active panel ID when it changes
        event.api.onDidActivePanelChange((panel) => {
            set({ activePanelId: panel?.id || null });
        });
    },

    setActivePanelId: (id) => {
        set({ activePanelId: id });
    },

    // Add a new panel to the dockview
    addPanel: (config) => {
        const { api } = get();
        if (api) {
            const panels = api.panels;
            const existingPanel = panels.find(p => p.id.startsWith(`${config.component}:`));

            if (existingPanel) {
                if (config.params) {
                    existingPanel.api.updateParameters(config.params);
                }
                existingPanel.focus();
            } else {
                api.addPanel(config);
            }
        }
    },
}));
