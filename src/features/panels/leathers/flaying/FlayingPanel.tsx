import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";

export interface IFlayingStoreState extends IPanelUIState {
    _placeholder?: string;
}

const FlayingPanel = () => {
    const initialUiState: IFlayingStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, IFlayingStoreState>
            kind={"flaying"}
            initialState={{uiState: initialUiState}}
        >
            <div>List placeholder for Flaying</div>
            <div>Form placeholder for Flaying</div>
        </GenericPanel>
    )
}

export default FlayingPanel;
