import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";

export interface ITypesStoreState extends IPanelUIState {
    _placeholder?: string;
}

const TypesPanel = () => {
    const initialUiState: ITypesStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, ITypesStoreState>
            kind={"types"}
            initialState={{uiState: initialUiState}}
        >
            <div>List placeholder for Types</div>
            <div>Form placeholder for Types</div>
        </GenericPanel>
    )
}

export default TypesPanel;
