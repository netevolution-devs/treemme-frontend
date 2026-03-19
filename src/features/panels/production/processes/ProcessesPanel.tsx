import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";
import ProcessesList from "@features/panels/production/processes/ProcessesList.tsx";

export interface IProcessesStoreState extends IPanelUIState {
    _placeholder?: string;
}

export interface IProcessStoreFilter {
    filterScheduledDate?: string;
}

const ProcessesPanel = () => {
    const initialUiState: IProcessesStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, IProcessesStoreState>
            kind={"processes"}
            initialState={{uiState: initialUiState}}
        >
            <ProcessesList />
        </GenericPanel>
    )
}

export default ProcessesPanel;
