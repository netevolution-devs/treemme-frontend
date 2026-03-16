import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";
import SelectionList from "@features/panels/products/selection/SelectionList.tsx";
import SelectionForm from "@features/panels/products/selection/SelectionForm.tsx";

export interface ISelectionStoreState extends IPanelUIState {
    selectedSelectionId?: number | null;
}

const SelectionPanel = () => {
    const initialUiState: ISelectionStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, ISelectionStoreState>
            kind={"selection"}
            initialState={{uiState: initialUiState}}
        >
            <SelectionList/>
            <SelectionForm/>
        </GenericPanel>
    )
}

export default SelectionPanel;
