import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";
import type {IDockviewPanelProps} from "dockview";
import type {ICustomPanelProps} from "@ui/panel/store/ICustomPanelPropst.ts";
import DeliveryNotesRowsForm from "@features/panels/shipping-invoicing/delivery-notes/delivery-notes-row/DeliveryNotesRowsForm.tsx";

export interface IDeliveryNotesRowsStoreState extends IPanelUIState {
    selectedDeliveryNoteRowId?: number | null;
}

export interface IDeliveryNotesRowsStoreParams {
    ddt_id?: number;
    ddt_row_id?: number;
}

const DeliveryNotesRowsPanel = (props: IDockviewPanelProps<ICustomPanelProps<IDeliveryNotesRowsStoreParams>>) => {
    const initialUiState: IDeliveryNotesRowsStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, IDeliveryNotesRowsStoreState>
            kind={"deliveryNotesRows"}
            initialState={{uiState: initialUiState}}
        >
            <DeliveryNotesRowsForm {...props.params}/>
        </GenericPanel>
    )
}

export default DeliveryNotesRowsPanel;
