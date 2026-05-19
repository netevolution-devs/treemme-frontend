import type {IBatchesLotsStoreState} from "@features/panels/analysis/batchesLots/BatchesLotsPanel";
import {useState} from "react";
import BatchesChronology from "@features/panels/production/batches/chronology/BatchesCronology";
import WarehouseMovementsList from "@features/panels/production/batches/movements/WarehouseMovementsList";
import GenericTabContent from "@features/panels/shared/GenericTabContent";
import BatchesForm from "@features/panels/production/batches/BatchesForm";
import BatchesLotsCostsList from "@features/panels/analysis/batchesLots/BatchesLotsCostsList";
import BatchesLotsSalesList from "@features/panels/analysis/batchesLots/BatchesLotsSalesList";

const BatchesLotsContent = () => {
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
                    {label: "Costi", component: <BatchesLotsCostsList/>},
                    {label: "Vendite", component: <BatchesLotsSalesList/>}
                ]}
            />
        </>
    )
}

export default BatchesLotsContent;