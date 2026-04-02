import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";
import SelectionList from "@features/panels/products/selection/SelectionList.tsx";
import SelectionForm from "@features/panels/products/selection/SelectionForm.tsx";
import type {IDockviewPanelProps} from "dockview";
import type {ICustomPanelProps} from "@ui/panel/store/ICustomPanelPropst.ts";

export interface ISelectionStoreState extends IPanelUIState {
    selectedSelectionId?: number | null;
}

const SelectionPanel = (props:  IDockviewPanelProps<ICustomPanelProps>) => {
    const initialUiState: ISelectionStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, ISelectionStoreState>
            kind={"selection"}
            initialState={{uiState: initialUiState}}
            listComponent={<SelectionList/>}
        >
            <SelectionForm {...props.params}/>
        </GenericPanel>
    )
}

export default SelectionPanel;
