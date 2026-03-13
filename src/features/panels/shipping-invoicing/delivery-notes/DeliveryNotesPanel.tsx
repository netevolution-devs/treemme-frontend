import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";
import DeliveryNotesList from "@features/panels/shipping-invoicing/delivery-notes/DeliveryNotesList.tsx";
import DeliveryNotesForm from "@features/panels/shipping-invoicing/delivery-notes/DeliveryNotesForm.tsx";

export interface IDeliveryNotesStoreState extends IPanelUIState {
    _placeholder?: string;
}

const DeliveryNotesPanel = () => {
    const initialUiState: IDeliveryNotesStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, IDeliveryNotesStoreState>
            kind={"deliveryNotes"}
            initialState={{uiState: initialUiState}}
        >
            <DeliveryNotesList/>
            <DeliveryNotesForm/>
        </GenericPanel>
    )
}

export default DeliveryNotesPanel;
