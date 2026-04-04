import {create} from 'zustand';
import type {AddPanelOptions, DockviewApi, DockviewReadyEvent, Parameters} from 'dockview';

/**
 Dockview store for managing dockview state
 **/

interface DockviewState {
    api: DockviewApi | null;
    activePanelId: string | null;
    addPanel: <T extends object = Parameters>(config: AddPanelOptions<T>, extraConf?: AddPanelExtraConfig) => void;
    handleReady: (event: DockviewReadyEvent) => void;
    setActivePanelId: (id: string | null) => void;
}

interface AddPanelExtraConfig {
    overrideLogic?: boolean;
}

export const useDockviewStore = create<DockviewState>((set, get) => ({
    api: null,
    activePanelId: null,

    // Handle dockview ready event
    handleReady: (event) => {
        set({api: event.api});

        // Update active panel ID when it changes
        event.api.onDidActivePanelChange((panel) => {
            set({activePanelId: panel?.id || null});
        });
    },

    setActivePanelId: (id) => {
        set({activePanelId: id});
    },

    // Add a new panel to the dockview
    addPanel: (config, {overrideLogic} = {overrideLogic: false}) => {
        const {api} = get();
        if (api) {
            const panels = api.panels;
            const existingPanel = panels.find(p => p.id.startsWith(`${config.component}:`));

            if (existingPanel && !overrideLogic) {
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
