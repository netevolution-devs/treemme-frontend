import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";
import OriginsList from "@features/panels/leathers/origins/OriginsList.tsx";
import OriginsForm from "@features/panels/leathers/origins/OriginsForm.tsx";

export interface IOriginsStoreState extends IPanelUIState {
    selectedOriginId?: number | null;
}

const OriginsPanel = () => {
    const initialUiState: IOriginsStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, IOriginsStoreState>
            kind={"origins"}
            initialState={{uiState: initialUiState}}
        >
            <OriginsList />
            <OriginsForm />
        </GenericPanel>
    )
}

export default OriginsPanel;
