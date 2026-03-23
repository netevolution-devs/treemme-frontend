import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";
import BatchesList from "@features/panels/production/batches/BatchesList.tsx";
import GenericTabContent from "@features/panels/shared/GenericTabContent.tsx";
import BatchesChronology from "@features/panels/production/batches/chronology/BatchesCronology.tsx";
import WarehouseMovementsList from "@features/panels/production/batches/movements/WarehouseMovementsList.tsx";
import BatchesSelection from "@features/panels/production/batches/selection/BatchesSelection.tsx";
import BatchesContent from "@features/panels/production/batches/BatchesContent.tsx";
import type {IDockviewPanelProps} from "dockview";
import type {ICustomPanelProps} from "@ui/panel/store/ICustomPanelPropst.ts";

export interface IBatchesStoreState extends IPanelUIState {
    selectedBatchId?: number | null;
}

export interface IBatchesStoreFilter {
    filterBatchCode?: string;
}

export interface IBatchesStoreParams {
    id: number;
    batch_code: string;
}

const BatchesPanel = (props: IDockviewPanelProps<ICustomPanelProps<IBatchesStoreParams>>) => {
    const initialUiState: IBatchesStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<IBatchesStoreFilter, IBatchesStoreState>
            kind={"batches"}
            initialState={{uiState: initialUiState}}
        >
            <BatchesList/>
            <GenericTabContent
                tabs={[
                    {label: "Lotto", component: <BatchesContent {...props.params}/>},
                    {label: "Cronologia", component: <BatchesChronology/>},
                    {label: "Scelte", component: <BatchesSelection/>},
                    {label: "Movimenti", component: <WarehouseMovementsList/>},
                ]}
            />
        </GenericPanel>
    )
}

export default BatchesPanel;
