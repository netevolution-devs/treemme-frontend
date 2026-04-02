import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";
import SeaPortsList from "@features/panels/contacts/seaports/SeaPortsList.tsx";
import SeaPortsForm from "@features/panels/contacts/seaports/SeaPortsForm.tsx";

export interface ISeaportsStoreState extends IPanelUIState {
    selectedSeaPortId?: number | null;
}

const SeaportsPanel = () => {
    const initialUiState: ISeaportsStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, ISeaportsStoreState>
            kind={"seaports"}
            initialState={{uiState: initialUiState}}
            listComponent={
                <SeaPortsList/>
            }
        >
            <SeaPortsForm/>
        </GenericPanel>
    )
}

export default SeaportsPanel;
