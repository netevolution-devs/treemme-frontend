import {BaseButtonState} from "@features/panels/shared/FormButtons";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons";
import GenericPanel from "@features/panels/shared/GenericPanel";
import BatchesList from "@features/panels/production/batches/BatchesList";
import GenericTabContent from "@features/panels/shared/GenericTabContent";
import BatchesChronology from "@features/panels/production/batches/chronology/BatchesCronology";
import WarehouseMovementsList from "@features/panels/production/batches/movements/WarehouseMovementsList";
import BatchesContent from "@features/panels/production/batches/BatchesContent";
import type {IDockviewPanelProps} from "dockview";
import type {ICustomPanelProps} from "@ui/panel/store/ICustomPanelPropst";
import {useEffect, useState} from "react";
import {usePanel} from "@ui/panel/PanelContext";
import BatchesSelectionList from "@features/panels/production/batches/selection/BatchesSelectionList";

export interface IBatchesStoreState extends IPanelUIState {
    selectedBatchId?: number | null;
}

export interface IBatchesStoreFilter {
    filterBatchCode?: string;
    filterBatchTypeId?: number | null
    filterYear?: number | null;
}

export interface IBatchesStoreParams {
    id: number;
    batch_code: string;
}

const BatchesPanelContent = (props: IDockviewPanelProps<ICustomPanelProps<IBatchesStoreParams>>) => {
    const [tabIndex, setTabIndex] = useState(0);
    const {useStore} = usePanel<IBatchesStoreFilter, IBatchesStoreState>();
    const setUIState = useStore(state => state.setUIState);
    const setFilters = useStore(state => state.setFilters);

    useEffect(() => {
        if (props.params.extra) {
            setUIState({selectedBatchId: props.params.extra.id});
            setFilters({filterBatchCode: props.params.extra.batch_code});
        }
    }, [props.params.extra, setUIState, setFilters]);

    return (
        <>
            <GenericTabContent
                value={tabIndex}
                onChange={(_, newValue) => setTabIndex(newValue)}
                tabs={[
                    {label: "Lotto", component: <BatchesContent/>},
                    {label: "Cronologia", component: <BatchesChronology/>},
                    {label: "Scelte", component: <BatchesSelectionList/>},
                    {label: "Movimenti", component: <WarehouseMovementsList/>},
                ]}
            />
        </>
    )
}

const BatchesPanel = (props: IDockviewPanelProps<ICustomPanelProps<IBatchesStoreParams>>) => {
    const initialUiState: IBatchesStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<IBatchesStoreFilter, IBatchesStoreState>
            kind={"batches"}
            initialState={{uiState: initialUiState}}
            listComponent={<BatchesList/>}
        >
            <BatchesPanelContent {...props}/>
        </GenericPanel>
    )
}

export default BatchesPanel;
