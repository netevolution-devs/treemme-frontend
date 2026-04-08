import {BaseButtonState} from "@features/panels/shared/FormButtons";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons";
import GenericPanel from "@features/panels/shared/GenericPanel";
import WorkAreaManagementList from "@features/panels/user-management/work-area/WorkAreaManagementList";
import WorkAreaManagementForm from "@features/panels/user-management/work-area/WorkAreaManagementForm";

export interface IFunctionalityManagementStoreState extends IPanelUIState {
    selectedWorkAreaId?: number | null;
}

const WorkAreaPanel = () => {
    const initialUiState: IFunctionalityManagementStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, IFunctionalityManagementStoreState>
            kind={"functionality-management"}
            initialState={{uiState: initialUiState}}
            listComponent={<WorkAreaManagementList/>}
        >
              <WorkAreaManagementForm/>
        </GenericPanel>
    )
}

export default WorkAreaPanel;
