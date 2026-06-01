import {BaseButtonState} from "@features/panels/shared/FormButtons";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons";
import GenericPanel from "@features/panels/shared/GenericPanel";
import type {IDockviewPanelProps} from "dockview";
import type {ICustomPanelProps} from "@ui/panel/store/ICustomPanelPropst";
import BatchCompositionForm from "@features/panels/production/batches/composition/BatchCompositionForm";

export interface IBatchCompositionStoreState extends IPanelUIState {
    selectedBatchCompositionId?: number | null;
}

export interface IBatchCompositionStoreParams {
    batch_id?: number;
    batch_composition_id?: number;
    panelId?: string;
}

const BatchCompositionPanel = (props: IDockviewPanelProps<ICustomPanelProps<IBatchCompositionStoreParams>>) => {
    const initialUiState: IBatchCompositionStoreState = {isFormDisabled: false, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, IBatchCompositionStoreState>
            kind={"batchComposition"}
            uuid={props.api.id}
            initialState={{uiState: initialUiState}}
            disableBorders
        >
            <BatchCompositionForm {...props.params}/>
        </GenericPanel>
    )
}

export default BatchCompositionPanel;
