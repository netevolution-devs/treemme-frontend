import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";
import BatchesList from "@features/panels/production/batches/BatchesList.tsx";
import BatchesForm from "@features/panels/production/batches/BatchesForm.tsx";

export interface IBatchesStoreState extends IPanelUIState {
    selectedBatchId?: number | null;
}

const BatchesPanel = () => {
    const initialUiState: IBatchesStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, IBatchesStoreState>
            kind={"batches"}
            initialState={{uiState: initialUiState}}
        >
            <BatchesList/>
            <BatchesForm/>
        </GenericPanel>
    )
}

export default BatchesPanel;
