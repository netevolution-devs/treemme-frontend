import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";
import WeightsList from "@features/panels/leathers/weights/WeightsList.tsx";
import WeightsForm from "@features/panels/leathers/weights/WeightsForm.tsx";
import type {ILeathersStoreState} from "@features/panels/leathers/leathers/LeathersPanel.tsx";
import WeightsContent from "@features/panels/leathers/weights/WeightsContent.tsx";
import type {IDockviewPanelProps} from "dockview";
import type {ICustomPanelProps} from "@ui/panel/store/ICustomPanelPropst.ts";

export interface IWeightsStoreState extends IPanelUIState, ILeathersStoreState {
    selectedWeightId?: number | null;
}

const WeightsPanel = (props: IDockviewPanelProps<ICustomPanelProps>) => {
    const initialUiState: IWeightsStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, IWeightsStoreState>
            kind={"weights"}
            initialState={{uiState: initialUiState}}
        >
            <WeightsList/>
            <WeightsForm {...props.params}/>
            <WeightsContent/>
        </GenericPanel>
    )
}

export default WeightsPanel;
