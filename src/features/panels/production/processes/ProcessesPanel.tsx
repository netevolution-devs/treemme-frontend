import {BaseButtonState} from "@features/panels/shared/FormButtons";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons";
import GenericPanel from "@features/panels/shared/GenericPanel";
import ProcessesList from "@features/panels/production/processes/ProcessesList";

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
        />
    )
}

export default ProcessesPanel;
