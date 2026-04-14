import {BaseButtonState} from "@features/panels/shared/FormButtons";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import GenericPanel from "@features/panels/shared/GenericPanel";

export interface IBatchDataStoreState extends IPanelUIState {
    selectedBatchId?: number | null;
    selectedBatchDataId?: number | null;
}

const BatchDataPanel = () => {
    const initialUiState: IBatchDataStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, IBatchDataStoreState>
            kind={"batchData"}
            initialState={{uiState: initialUiState}}
            disableBorders
        >
            <div>Works</div>
        </GenericPanel>
    )
}

export default BatchDataPanel;
