
import {BaseButtonState} from "@features/panels/shared/FormButtons";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons";
import GenericPanel from "@features/panels/shared/GenericPanel";
import MovementsList from "@features/panels/warehouse/movements/MovementsList";
import MovementsForm from "@features/panels/warehouse/movements/MovementsForm";
import type {IDockviewPanelProps} from "dockview";
import type {ICustomPanelProps} from "@ui/panel/store/ICustomPanelPropst";
import {usePanel} from "@ui/panel/PanelContext";
import {Stack} from "@mui/material";

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
            listComponent={<MovementsContent/>}
        />
    )
}

const MovementsContent = () => {
    const {useStore} = usePanel<IMovementStoreFilter, IMovementsStoreState>();
    const selectedMovementId = useStore(state => state.uiState.selectedMovementId);

    return (
        <Stack gap={1.5} sx={{flex: 1, minHeight: 0}}>
            <MovementsList/>
            {selectedMovementId != null && (
                <Stack gap={0.5} sx={{
                    flex: 1,
                    borderTop: "3px solid",
                    borderRadius: 1,
                    borderColor: "primary.main",
                    backgroundColor: "background.paper",
                    p: 1,
                }}>
                    <MovementsForm/>
                </Stack>
            )}
        </Stack>
    )
}

export default MovementsPanel;
