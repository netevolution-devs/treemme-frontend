import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";

export interface ILeathersStoreState extends IPanelUIState {
    _placeholder?: string;
}

const LeathersPanel = () => {
    const initialUiState: ILeathersStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, ILeathersStoreState>
            kind={"leathers"}
            initialState={{uiState: initialUiState}}
        >
            <div>List placeholder for Leathers</div>
            <div>Form placeholder for Leathers</div>
        </GenericPanel>
    )
}

export default LeathersPanel;
