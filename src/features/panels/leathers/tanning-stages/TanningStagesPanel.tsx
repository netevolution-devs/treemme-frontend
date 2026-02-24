import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";
import TanningStagesList from "@features/panels/leathers/tanning-stages/TanningStagesList.tsx";
import TanningStagesForm from "@features/panels/leathers/tanning-stages/TanningStagesForm.tsx";

export interface ITanningStagesStoreState extends IPanelUIState {
    selectedTanningStageId?: number | null;
}

const TanningStagesPanel = () => {
    const initialUiState: ITanningStagesStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, ITanningStagesStoreState>
            kind={"tanningStages"}
            initialState={{uiState: initialUiState}}
        >
            <TanningStagesList />
            <TanningStagesForm />
        </GenericPanel>
    )
}

export default TanningStagesPanel;
