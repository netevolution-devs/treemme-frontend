import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";
import SizesList from "@features/panels/leathers/sizes/SizesList.tsx";
import SizesForm from "@features/panels/leathers/sizes/SizesForm.tsx";

export interface ISizesStoreState extends IPanelUIState {
    selectedSizeId?: number | null;
}

const SizesPanel = () => {
    const initialUiState: ISizesStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, ISizesStoreState>
            kind={"sizes"}
            initialState={{uiState: initialUiState}}
        >
            <SizesList />
            <SizesForm />
        </GenericPanel>
    )
}

export default SizesPanel;
