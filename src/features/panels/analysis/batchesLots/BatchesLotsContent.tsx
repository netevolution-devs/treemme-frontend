import type {IBatchesLotsStoreState} from "@features/panels/analysis/batchesLots/BatchesLotsPanel";
import {batchApi} from "@features/panels/production/batches/api/batchApi";
import {usePanel} from "@ui/panel/PanelContext";
import {useState} from "react";
import BatchesChronology from "@features/panels/production/batches/chronology/BatchesCronology";
import WarehouseMovementsList from "@features/panels/production/batches/movements/WarehouseMovementsList";
import GenericTabContent from "@features/panels/shared/GenericTabContent";
import BatchesForm from "@features/panels/production/batches/BatchesForm";

const BatchesLotsContent = () => {
    const {useStore} = usePanel<unknown, IBatchesLotsStoreState>();
    const selectedBatchId = useStore(state => state.uiState.selectedBatchId);

    const {data: batchReport} = batchApi.useGetBatchReport(selectedBatchId as number);

    const [tabIndex, setTabIndex] = useState(0);

    return (
        <>
            <GenericTabContent
                value={tabIndex}
                onChange={(_, newValue) => setTabIndex(newValue)}
                tabs={[
                    {label: "Lotto", component: <BatchesForm disableFunctions/>},
                    {label: "Movimenti", component: <WarehouseMovementsList/>},
                    {label: "Cronologia", component: <BatchesChronology/>},
                    {label: "Costi", component: <>Costi</>},
                    {label: "Vendite", component: <>Vendite</>}
                ]}
            />
            <pre>{JSON.stringify(batchReport, null, 2)}</pre>
        </>
    )
}

export default BatchesLotsContent;