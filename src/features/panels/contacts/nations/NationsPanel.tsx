import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";
import NationsList from "@features/panels/contacts/nations/NationsList.tsx";

export interface INationsStoreState extends IPanelUIState {
    selectedNationId?: number | null;
}

const NationsPanel = () => {
    const initialUiState: INationsStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, INationsStoreState>
            kind={"nations"}
            initialState={{uiState: initialUiState}}
        >
            <NationsList />
            <div>Form placeholder for Nations</div>
        </GenericPanel>
    )
}

export default NationsPanel;
