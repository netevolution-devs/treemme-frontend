import {BaseButtonState} from "@features/panels/shared/FormButtons";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons";
import GenericPanel from "@features/panels/shared/GenericPanel";
import PalletsList from "@features/panels/warehouse/pallets/PalletsList";
import PalletsForm from "@features/panels/warehouse/pallets/PalletsForm";
import type {IDockviewPanelProps} from "dockview";
import type {ICustomPanelProps} from "@ui/panel/store/ICustomPanelPropst";

export interface IPalletsStoreState extends IPanelUIState {
    selectedPalletId?: number | null;
}

const PalletsPanel = (props: IDockviewPanelProps<ICustomPanelProps>) => {
    const initialUiState: IPalletsStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, IPalletsStoreState>
            kind={"pallets"}
            uuid={props.api.id}
            initialState={{uiState: initialUiState, filters: {}}}
            listComponent={<PalletsList/>}
        >
            <PalletsForm/>
        </GenericPanel>
    )
}

export default PalletsPanel;
