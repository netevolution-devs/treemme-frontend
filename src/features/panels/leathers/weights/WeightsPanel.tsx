import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";
import WeightsList from "@features/panels/leathers/weights/WeightsList.tsx";
import WeightsForm from "@features/panels/leathers/weights/WeightsForm.tsx";

export interface IWeightsStoreState extends IPanelUIState {
    selectedWeightId?: number | null;
}

const WeightsPanel = () => {
    const initialUiState: IWeightsStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, IWeightsStoreState>
            kind={"weights"}
            initialState={{uiState: initialUiState}}
        >
            <WeightsList />
            <WeightsForm />
        </GenericPanel>
    )
}

export default WeightsPanel;
