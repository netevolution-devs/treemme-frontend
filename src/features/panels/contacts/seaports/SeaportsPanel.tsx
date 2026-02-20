import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";

export interface ISeaportsStoreState extends IPanelUIState {
    _placeholder?: string;
}

const SeaportsPanel = () => {
    const initialUiState: ISeaportsStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, ISeaportsStoreState>
            kind={"seaports"}
            initialState={{uiState: initialUiState}}
        >
            <div>List placeholder for Seaports</div>
            <div>Form placeholder for Seaports</div>
        </GenericPanel>
    )
}

export default SeaportsPanel;
