import {BaseButtonState} from "@features/panels/shared/FormButtons";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons";
import GenericPanel from "@features/panels/shared/GenericPanel";
import WeightsList from "@features/panels/leathers/weights/WeightsList";
import WeightsForm from "@features/panels/leathers/weights/WeightsForm";
import type {ILeathersStoreState} from "@features/panels/leathers/leathers/LeathersPanel";
import WeightsContent from "@features/panels/leathers/weights/WeightsContent";
import type {IDockviewPanelProps} from "dockview";
import type {ICustomPanelProps} from "@ui/panel/store/ICustomPanelPropst";

export interface IWeightsStoreState extends IPanelUIState, ILeathersStoreState {
    selectedWeightId?: number | null;
}

const WeightsPanel = (props: IDockviewPanelProps<ICustomPanelProps>) => {
    const initialUiState: IWeightsStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, IWeightsStoreState>
            kind={"weights"}
            initialState={{uiState: initialUiState}}
            listComponent={<WeightsList/>}
        >
            <WeightsForm {...props.params}/>
            <WeightsContent/>
        </GenericPanel>
    )
}

export default WeightsPanel;
