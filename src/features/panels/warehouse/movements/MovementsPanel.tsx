
import {BaseButtonState} from "@features/panels/shared/FormButtons";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons";
import GenericPanel from "@features/panels/shared/GenericPanel";
import MovementsList from "@features/panels/warehouse/movements/MovementsList";

export interface IMovementStoreFilter {
    filterBatchCode?: string;
}

export interface IMovementsStoreState extends IPanelUIState {
    selectedMovementId?: number | null;
}

const MovementsPanel = () => {
    const initialUiState: IMovementsStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, IMovementsStoreState>
            kind={"movements"}
            initialState={{uiState: initialUiState}}
            listComponent={<MovementsList/>}
        />
    )
}

export default MovementsPanel;
