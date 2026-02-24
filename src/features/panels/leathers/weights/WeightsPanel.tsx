import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";

export interface IWeightsStoreState extends IPanelUIState {
    _placeholder?: string;
}

const WeightsPanel = () => {
    const initialUiState: IWeightsStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, IWeightsStoreState>
            kind={"weights"}
            initialState={{uiState: initialUiState}}
        >
            <div>List placeholder for Weights</div>
            <div>Form placeholder for Weights</div>
        </GenericPanel>
    )
}

export default WeightsPanel;
