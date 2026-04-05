import {BaseButtonState} from "@features/panels/shared/FormButtons";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons";
import GenericPanel from "@features/panels/shared/GenericPanel";
import ReasonsList from "@features/panels/shipping-invoicing/reasons/ReasonsList";
import ReasonsForm from "@features/panels/shipping-invoicing/reasons/ReasonsForm";

export interface IReasonsStoreState extends IPanelUIState {
    selectedDeliveryReasonId?: number | null;
}

const ReasonsPanel = () => {
    const initialUiState: IReasonsStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, IReasonsStoreState>
            kind={"reasons"}
            initialState={{uiState: initialUiState}}
            listComponent={<ReasonsList/>}
        >
            <ReasonsForm/>
        </GenericPanel>
    )
}

export default ReasonsPanel;
