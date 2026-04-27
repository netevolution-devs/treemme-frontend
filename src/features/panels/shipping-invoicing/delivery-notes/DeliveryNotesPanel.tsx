import {BaseButtonState} from "@features/panels/shared/FormButtons";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons";
import GenericPanel from "@features/panels/shared/GenericPanel";
import DeliveryNotesList from "@features/panels/shipping-invoicing/delivery-notes/DeliveryNotesList";
import DeliveryNotesForm from "@features/panels/shipping-invoicing/delivery-notes/DeliveryNotesForm";
import {Box} from "@mui/material";
import DeliveryNotesRowsList
    from "@features/panels/shipping-invoicing/delivery-notes/delivery-notes-row/DeliveryNotesRowsList";

export interface IDeliveryNotesStoreState extends IPanelUIState {
    selectedDeliveryNoteId?: number | null;
    selectedDeliveryNoteRowId?: number | null;
}

export interface IDeliveryNotesStoreFilter {
    filterSubcontractorId?: number | null;
    filterStartDate?: string;
    filterEndDate?: string;
}

const DeliveryNotesPanel = () => {
    const initialUiState: IDeliveryNotesStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<IDeliveryNotesStoreFilter, IDeliveryNotesStoreState>
            kind={"deliveryNotes"}
            initialState={{uiState: initialUiState}}
            listComponent={<DeliveryNotesList/>}
        >
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 2,
                alignItems: 'flex-start'
            }}>
                <Box sx={{flex: '1 1 600px', minWidth: 0}}>
                    <DeliveryNotesForm/>
                </Box>
                <Box sx={{flex: '1 1 600px', minWidth: 0}}>
                    <DeliveryNotesRowsList/>
                </Box>
            </Box>
        </GenericPanel>
    )
}

export default DeliveryNotesPanel;
