import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";
import BatchesList from "@features/panels/production/batches/BatchesList.tsx";
import GenericTabContent from "@features/panels/shared/GenericTabContent.tsx";
import BatchesChronology from "@features/panels/production/batches/chronology/BatchesCronology.tsx";
import WarehouseMovementsList from "@features/panels/production/batches/movements/WarehouseMovementsList.tsx";
import BatchesSelection from "@features/panels/production/batches/selection/BatchesSelection.tsx";
import BatchesContent from "@features/panels/production/batches/BatchesContent.tsx";

export interface IBatchesStoreState extends IPanelUIState {
    selectedBatchId?: number | null;
}

export interface IBatchesStoreFilter {
    filterBatchCode?: string;
}

const BatchesPanel = () => {
    const initialUiState: IBatchesStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<IBatchesStoreFilter, IBatchesStoreState>
            kind={"batches"}
            initialState={{uiState: initialUiState}}
        >
            <BatchesList/>
            <GenericTabContent
                tabs={[
                    {label: "Lotto", component: <BatchesContent/>},
                    {label: "Cronologia", component: <BatchesChronology/>},
                    {label: "Scelte", component: <BatchesSelection/>},
                    {label: "Movimenti", component: <WarehouseMovementsList/>},
                ]}
            />
        </GenericPanel>
    )
}

export default BatchesPanel;
