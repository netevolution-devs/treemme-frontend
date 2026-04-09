import { useEffect, useCallback } from "react";
import { useDockviewStore } from "@ui/panel/store/DockviewStore";

interface PanelFormLogicProps {
    initialName: string | undefined;
    selectedId: number | null | undefined;
    onSuccess: ((id: number) => void) | undefined;
    setFormState: (state: 'new' | 'edit' | 'view') => void;
}

export const usePanelFormLogic = ({
                                      initialName,
                                      selectedId,
                                      onSuccess,
                                      setFormState
                                  }: PanelFormLogicProps) => {
    const api = useDockviewStore(state => state.api);

    useEffect(() => {
        if (initialName && !selectedId) {
            setFormState('new');
        }
    }, [initialName, selectedId, setFormState]);

    const handlePanelSuccess = useCallback((entity: { id: number }) => {
        onSuccess?.(entity.id);

        if (initialName && api) {
            const panels = api.panels;
            const currentPanel = Object.values(panels).find(
                p => p.params?.initialName === initialName
            );

            if (currentPanel) {
                currentPanel.api.close();
            }
        }
    }, [onSuccess, initialName, api]);

    return { handlePanelSuccess };
};