import {BaseButtonState} from "@features/panels/shared/FormButtons";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons";
import GenericPanel from "@features/panels/shared/GenericPanel";
import TanningStagesList from "@features/panels/leathers/tanning-stages/TanningStagesList";
import TanningStagesForm from "@features/panels/leathers/tanning-stages/TanningStagesForm";
import type {ILeathersStoreState} from "@features/panels/leathers/leathers/LeathersPanel";
import TanningStagesContent from "@features/panels/leathers/tanning-stages/TanningStagesContent";
import type {IDockviewPanelProps} from "dockview";
import type {ICustomPanelProps} from "@ui/panel/store/ICustomPanelPropst";

export interface ITanningStagesStoreState extends IPanelUIState, ILeathersStoreState {
    selectedTanningStageId?: number | null;
}

const TanningStagesPanel = (props: IDockviewPanelProps<ICustomPanelProps>) => {
    const initialUiState: ITanningStagesStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, ITanningStagesStoreState>
            kind={"tanningStages"}
            initialState={{uiState: initialUiState}}
            listComponent={<TanningStagesList/>}
        >
            <TanningStagesForm {...props.params}/>
            <TanningStagesContent/>
        </GenericPanel>
    )
}

export default TanningStagesPanel;
