import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";

export interface IThicknessesStoreState extends IPanelUIState {
    _placeholder?: string;
}

const ThicknessesPanel = () => {
    const initialUiState: IThicknessesStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, IThicknessesStoreState>
            kind={"thicknesses"}
            initialState={{uiState: initialUiState}}
        >
            <div>List placeholder for Thicknesses</div>
            <div>Form placeholder for Thicknesses</div>
        </GenericPanel>
    )
}

export default ThicknessesPanel;
