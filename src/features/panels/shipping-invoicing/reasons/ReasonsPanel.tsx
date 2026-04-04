import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";
import ReasonsList from "@features/panels/shipping-invoicing/reasons/ReasonsList.tsx";
import ReasonsForm from "@features/panels/shipping-invoicing/reasons/ReasonsForm.tsx";

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
