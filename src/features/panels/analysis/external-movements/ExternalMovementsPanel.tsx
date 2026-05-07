
import {BaseButtonState} from "@features/panels/shared/FormButtons";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons";
import GenericPanel from "@features/panels/shared/GenericPanel";
import ExternalMovementsList from "@features/panels/analysis/external-movements/ExternalMovementsList";

export interface IExternalMovementsStoreFilter {
    filterStartDate?: string;
    filterEndDate?: string;
    filterSubcontractorId?: number;
    filterBatchCode?: string;
}

export interface IExternalMovementsStoreState extends IPanelUIState {
    selectedExternalMovementId?: number | null;
}

const ExternalMovementsPanel = () => {
    const initialUiState: IExternalMovementsStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<IExternalMovementsStoreFilter, IExternalMovementsStoreState>
            kind={"externalMovements"}
            initialState={{uiState: initialUiState}}
            listComponent={<ExternalMovementsList/>}
        />
    )
}

export default ExternalMovementsPanel;
