import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";

export interface ITanningStagesStoreState extends IPanelUIState {
    _placeholder?: string;
}

const TanningStagesPanel = () => {
    const initialUiState: ITanningStagesStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, ITanningStagesStoreState>
            kind={"tanning-stages"}
            initialState={{uiState: initialUiState}}
        >
            <div>List placeholder for Tanning-stages</div>
            <div>Form placeholder for Tanning-stages</div>
        </GenericPanel>
    )
}

export default TanningStagesPanel;
