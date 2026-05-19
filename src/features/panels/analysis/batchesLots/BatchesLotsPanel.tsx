
import {BaseButtonState} from "@features/panels/shared/FormButtons";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons";
import GenericPanel from "@features/panels/shared/GenericPanel";
import BatchesForm from "@features/panels/production/batches/BatchesForm";
import BatchesList from "@features/panels/production/batches/BatchesList";
import BatchesLotsContent from "@features/panels/analysis/batchesLots/BatchesLotsContent";

export interface IBatchesLotsStoreState extends IPanelUIState {
    selectedBatchId?: number | null;
}

const BatchesLotsPanel = () => {
    const initialUiState: IBatchesLotsStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, IBatchesLotsStoreState>
            kind={"batchesLots"}
            initialState={{uiState: initialUiState}}
            listComponent={<BatchesList/>}
        >
            <BatchesForm disableFunctions />
            <BatchesLotsContent/>
        </GenericPanel>
    )
}

export default BatchesLotsPanel;
