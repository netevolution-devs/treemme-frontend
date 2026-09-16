import { useEffect, useCallback } from "react";
import { useDockviewStore } from "@ui/panel/store/DockviewStore";
import { usePanelMeta } from "@ui/panel/PanelContext";

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
    const { panelId } = usePanelMeta();

    useEffect(() => {
        if (initialName && !selectedId) {
            setFormState('new');
        }
    }, [initialName, selectedId, setFormState]);

    const handlePanelSuccess = useCallback((entity: { id: number }) => {
        onSuccess?.(entity.id);

        if (api) {
            // Resolve the submitting panel by identity: focus and names are not unique.
            const currentPanel = api.getPanel(panelId);

            if (currentPanel && (
                (initialName && currentPanel.params?.initialName === initialName) ||
                currentPanel.params?.extra?.panelId === panelId
            )) {
                currentPanel.api.close();
            }
        }
    }, [onSuccess, initialName, api, panelId]);

    return { handlePanelSuccess };
};
