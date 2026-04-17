import {BaseButtonState} from "@features/panels/shared/FormButtons";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import GenericPanel from "@features/panels/shared/GenericPanel";
import BatchDataForm from "@features/panels/production/batches/batch-data/BatchDataForm";
import type {IDockviewPanelProps} from "dockview";
import type {ICustomPanelProps} from "@ui/panel/store/ICustomPanelPropst";

export interface IBatchDataStoreState extends IPanelUIState {
    selectedBatchId?: number | null;
    selectedBatchDataId?: number | null;
}

export interface IBatchDataStoreParams {
    batchId: number;
    batchDataId: number;
    panelId: string;
}

const BatchDataPanel = (props: IDockviewPanelProps<ICustomPanelProps<IBatchDataStoreParams>>) => {
    const initialUiState: IBatchDataStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, IBatchDataStoreState>
            kind={"batchData"}
            initialState={{uiState: initialUiState}}
            disableBorders
        >
            <BatchDataForm {...props.params}/>
        </GenericPanel>
    )
}

export default BatchDataPanel;
