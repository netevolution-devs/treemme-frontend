import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";

export interface ISizesStoreState extends IPanelUIState {
    _placeholder?: string;
}

const SizesPanel = () => {
    const initialUiState: ISizesStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, ISizesStoreState>
            kind={"sizes"}
            initialState={{uiState: initialUiState}}
        >
            <div>List placeholder for Sizes</div>
            <div>Form placeholder for Sizes</div>
        </GenericPanel>
    )
}

export default SizesPanel;
