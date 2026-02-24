import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";
import TypesList from "@features/panels/leathers/types/TypesList.tsx";
import TypesForm from "@features/panels/leathers/types/TypesForm.tsx";

export interface ITypesStoreState extends IPanelUIState {
    selectedTypeId?: number | null;
}

const TypesPanel = () => {
    const initialUiState: ITypesStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, ITypesStoreState>
            kind={"types"}
            initialState={{uiState: initialUiState}}
        >
            <TypesList />
            <TypesForm />
        </GenericPanel>
    )
}

export default TypesPanel;
