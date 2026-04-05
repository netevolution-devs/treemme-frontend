import {BaseButtonState} from "@features/panels/shared/FormButtons";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons";
import GenericPanel from "@features/panels/shared/GenericPanel";
import WorkAreaManagementList from "@features/panels/user-management/WorkAreaManagementList";
import WorkAreaManagementForm from "@features/panels/user-management/WorkAreaManagementForm";

export interface IFunctionalityManagementStoreState extends IPanelUIState {
    selectedWorkAreaId?: number | null;
}

const FunctionalityManagementPanel = () => {
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

export default FunctionalityManagementPanel;
