import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";

export interface ISpeciesStoreState extends IPanelUIState {
    _placeholder?: string;
}

const SpeciesPanel = () => {
    const initialUiState: ISpeciesStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, ISpeciesStoreState>
            kind={"species"}
            initialState={{uiState: initialUiState}}
        >
            <div>List placeholder for Species</div>
            <div>Form placeholder for Species</div>
        </GenericPanel>
    )
}

export default SpeciesPanel;
