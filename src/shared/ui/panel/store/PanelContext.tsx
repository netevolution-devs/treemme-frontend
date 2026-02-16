import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { storeCache, getOrCreatePanelStore } from './createPanelStore';
import type {SelectedMap} from "@ui/panel/store/panelBase.ts";

interface PanelContextProps {
    kind: string;
    instanceId: string;
}

const PanelContext = createContext<PanelContextProps | null>(null);

export const PanelProvider: React.FC<{
    kind: string;
    children: React.ReactNode;
}> = ({ kind, children }) => {
    // Genera un ID univoco al mount del pannello
    const [instanceId] = useState(() => crypto.randomUUID());

    // Cleanup: quando il pannello viene distrutto, rimuoviamo lo store dalla RAM
    useEffect(() => {
        return () => {
            storeCache.delete(`${kind}:${instanceId}`);
        };
    }, [kind, instanceId]);

    const value = useMemo(() => ({ kind, instanceId }), [kind, instanceId]);

    return <PanelContext.Provider value={value}>{children}</PanelContext.Provider>;
};

/**
 * Hook per consumare lo store correlandolo automaticamente all'istanza del Provider
 */
export function useCurrentPanelStore<F extends object, K extends string = string>(
    defaultFilters: F,
    defaultSelected?: SelectedMap<K>
) {
    const context = useContext(PanelContext);
    if (!context) {
        throw new Error('useCurrentPanelStore must be used within a PanelProvider');
    }

    const useStore = getOrCreatePanelStore<F, K>(
        context.kind,
        context.instanceId,
        defaultFilters,
        defaultSelected
    );

    return useStore();
}