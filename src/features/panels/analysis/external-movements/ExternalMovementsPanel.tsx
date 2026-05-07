
import {BaseButtonState} from "@features/panels/shared/FormButtons";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons";
import GenericPanel from "@features/panels/shared/GenericPanel";
import ExternalMovementsList from "@features/panels/analysis/external-movements/ExternalMovementsList";

export interface IExternalMovementsStoreState extends IPanelUIState {
    _placeholder?: string;
}

const ExternalMovementsPanel = () => {
    const initialUiState: IExternalMovementsStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, IExternalMovementsStoreState>
            kind={"externalMovements"}
            initialState={{uiState: initialUiState}}
            listComponent={<ExternalMovementsList/>}
        />
    )
}

export default ExternalMovementsPanel;
