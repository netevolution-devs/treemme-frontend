import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";

export interface INationsStoreState extends IPanelUIState {
    
}

const NationsPanel = () => {
    const initialUiState: INationsStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, INationsStoreState>
            kind={"nations"}
            initialState={{uiState: initialUiState}}
        >
            <div>List placeholder for Nations</div>
            <div>Form placeholder for Nations</div>
        </GenericPanel>
    )
}

export default NationsPanel;
