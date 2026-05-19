import type {IBatchesLotsStoreState} from "@features/panels/analysis/batchesLots/BatchesLotsPanel";
import {batchApi} from "@features/panels/production/batches/api/batchApi";
import {usePanel} from "@ui/panel/PanelContext";

const BatchesLotsContent = () => {
    const {useStore} = usePanel<unknown, IBatchesLotsStoreState>();
    const selectedBatchId = useStore(state => state.uiState.selectedBatchId);

    const {data: batchReport} = batchApi.useGetBatchReport(selectedBatchId as number);

    return (
        <>
            <pre>{JSON.stringify(batchReport, null, 2)}</pre>
        </>
    )
}

export default BatchesLotsContent;