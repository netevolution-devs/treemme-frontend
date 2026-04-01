import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";
import ProcessesList from "@features/panels/production/processes/ProcessesList.tsx";

export interface IProcessesStoreState extends IPanelUIState {
    selectedProcessId?: number | null;
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
            listComponent={<ProcessesList />}
            disableContent
        />
    )
}

export default ProcessesPanel;
