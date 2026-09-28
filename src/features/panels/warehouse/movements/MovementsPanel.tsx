
import {BaseButtonState} from "@features/panels/shared/FormButtons";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons";
import GenericPanel from "@features/panels/shared/GenericPanel";
import MovementsList from "@features/panels/warehouse/movements/MovementsList";
import MovementsForm from "@features/panels/warehouse/movements/MovementsForm";
import type {IDockviewPanelProps} from "dockview";
import type {ICustomPanelProps} from "@ui/panel/store/ICustomPanelPropst";

export interface IMovementStoreFilter {
    filterBatchCode?: string;
}

export interface IMovementsStoreState extends IPanelUIState {
    selectedMovementId?: number | null;
}

const MovementsPanel = (props: IDockviewPanelProps<ICustomPanelProps>) => {
    const initialUiState: IMovementsStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<IMovementStoreFilter, IMovementsStoreState>
            kind={"movements"}
            uuid={props.api.id}
            initialState={{uiState: initialUiState}}
            listComponent={<MovementsList/>}
        >
            <MovementsForm/>
        </GenericPanel>
    )
}

export default MovementsPanel;
