import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";

export interface IOriginsStoreState extends IPanelUIState {
    _placeholder?: string;
}

const OriginsPanel = () => {
    const initialUiState: IOriginsStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, IOriginsStoreState>
            kind={"origins"}
            initialState={{uiState: initialUiState}}
        >
            <div>List placeholder for Origins</div>
            <div>Form placeholder for Origins</div>
        </GenericPanel>
    )
}

export default OriginsPanel;
