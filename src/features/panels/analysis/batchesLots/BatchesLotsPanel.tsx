
import {BaseButtonState} from "@features/panels/shared/FormButtons";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons";
import GenericPanel from "@features/panels/shared/GenericPanel";
import BatchesList from "@features/panels/production/batches/BatchesList";
import BatchesLotsContent from "@features/panels/analysis/batchesLots/BatchesLotsContent";
import {batchTypeApi} from "@features/panels/production/batches/api/batch-type/batchTypeApi";

export interface IBatchesLotsStoreState extends IPanelUIState {
    selectedBatchId?: number | null;
}

const BatchesLotsPanel = () => {
    const initialUiState: IBatchesLotsStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    const {data: batchTypes = []} = batchTypeApi.useGetList();
    const batchBaseTypeId = batchTypes.find(batchType => batchType.name === "Lotto")?.id;

    return (
        <GenericPanel<unknown, IBatchesLotsStoreState>
            kind={"batchesLots"}
            initialState={{uiState: initialUiState}}
            listComponent={<BatchesList preselectedBatchTypeId={batchBaseTypeId as number}/>}
        >
            <BatchesLotsContent/>
        </GenericPanel>
    )
}

export default BatchesLotsPanel;
