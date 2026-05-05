import {BaseButtonState} from "@features/panels/shared/FormButtons";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons";
import GenericPanel from "@features/panels/shared/GenericPanel";
import WorkAreaManagementList from "@features/panels/user-management/work-area/WorkAreaManagementList";
import WorkAreaManagementForm from "@features/panels/user-management/work-area/WorkAreaManagementForm";
import type {IDockviewPanelProps} from "dockview";
import type {ICustomPanelProps} from "@ui/panel/store/ICustomPanelPropst";

export interface IFunctionalityManagementStoreState extends IPanelUIState {
    selectedWorkAreaId?: number | null;
}

const WorkAreaPanel = (props: IDockviewPanelProps<ICustomPanelProps>) => {
    const initialUiState: IFunctionalityManagementStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, IFunctionalityManagementStoreState>
            kind={"functionality-management"}
            uuid={props.api.id}
            initialState={{uiState: initialUiState}}
            listComponent={<WorkAreaManagementList/>}
        >
              <WorkAreaManagementForm/>
        </GenericPanel>
    )
}

export default WorkAreaPanel;
