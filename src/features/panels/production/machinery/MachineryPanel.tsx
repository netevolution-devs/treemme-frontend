import {BaseButtonState} from "@features/panels/shared/FormButtons";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons";
import GenericPanel from "@features/panels/shared/GenericPanel";
import MachineryForm from "@features/panels/production/machinery/MachineryForm";
import MachineryList from "@features/panels/production/machinery/MachineryList";

export interface IMachineryStoreState extends IPanelUIState {
    selectedMachineryId?: number | null;
}

const MachineryPanel = () => {
    const initialUiState: IMachineryStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, IMachineryStoreState>
            kind={"machinery"}
            initialState={{uiState: initialUiState}}
            listComponent={<MachineryList/>}
        >
            <MachineryForm/>
        </GenericPanel>
    )
}

export default MachineryPanel;
