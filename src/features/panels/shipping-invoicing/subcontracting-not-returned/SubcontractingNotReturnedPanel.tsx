import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";
import type {IDeliveryNotesStoreState} from "@features/panels/shipping-invoicing/delivery-notes/DeliveryNotesPanel.tsx";
import DeliveryNotesList from "@features/panels/shipping-invoicing/delivery-notes/DeliveryNotesList.tsx";
import DeliveryNotesRowList
    from "@features/panels/shipping-invoicing/delivery-notes/delivery-notes-row/DeliveryNotesRowList.tsx";

const SubcontractingNotReturnedPanel = () => {
    const initialUiState: IDeliveryNotesStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, IDeliveryNotesStoreState>
            kind={"subcontractingNotReturned"}
            initialState={{uiState: initialUiState}}
        >
            <DeliveryNotesList showNotReturned/>
            <DeliveryNotesRowList/>
        </GenericPanel>
    )
}

export default SubcontractingNotReturnedPanel;
