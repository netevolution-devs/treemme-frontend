import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";
import WorkingsList from "@features/panels/production/workings/WorkingsList.tsx";
import WorkingsForm from "@features/panels/production/workings/WorkingsForm.tsx";

export interface IWorkingsStoreState extends IPanelUIState {
    selectedWorkingId?: number | null;
}

const WorkingsPanel = () => {
    const initialUiState: IWorkingsStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, IWorkingsStoreState>
            kind={"workings"}
            initialState={{uiState: initialUiState}}
            listComponent={<WorkingsList/>}
        >
            <WorkingsForm/>
        </GenericPanel>
    )
}

export default WorkingsPanel;
