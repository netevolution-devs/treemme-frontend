import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";
import MachineryForm from "@features/panels/production/machinery/MachineryForm.tsx";
import MachineryList from "@features/panels/production/machinery/MachineryList.tsx";

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
