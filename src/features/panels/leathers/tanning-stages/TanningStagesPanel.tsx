import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";
import TanningStagesList from "@features/panels/leathers/tanning-stages/TanningStagesList.tsx";
import TanningStagesForm from "@features/panels/leathers/tanning-stages/TanningStagesForm.tsx";
import type {ILeathersStoreState} from "@features/panels/leathers/leathers/LeathersPanel.tsx";
import TanningStagesContent from "@features/panels/leathers/tanning-stages/TanningStagesContent.tsx";
import type {IDockviewPanelProps} from "dockview";
import type {ICustomPanelProps} from "@ui/panel/store/ICustomPanelPropst.ts";

export interface ITanningStagesStoreState extends IPanelUIState, ILeathersStoreState {
    selectedTanningStageId?: number | null;
}

const TanningStagesPanel = (props: IDockviewPanelProps<ICustomPanelProps>) => {
    const initialUiState: ITanningStagesStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, ITanningStagesStoreState>
            kind={"tanningStages"}
            initialState={{uiState: initialUiState}}
        >
            <TanningStagesList/>
            <TanningStagesForm {...props.params}/>
            <TanningStagesContent/>
        </GenericPanel>
    )
}

export default TanningStagesPanel;
