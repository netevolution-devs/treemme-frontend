import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";
import ContactsList from "@features/panels/contacts/contacts/ContactsList.tsx";
import ContactsForm from "@features/panels/contacts/contacts/ContactsForm.tsx";
import ContactsAddressContent from "@features/panels/contacts/contacts/address/ContactsAddressContent.tsx";
import ContactsDetailContent from "@features/panels/contacts/contacts/detail/ContactsDetailContent.tsx";
import {Box, Stack} from "@mui/material";

export interface IContactsStoreState extends IPanelUIState {
    selectedContactId?: number | null;
    selectedAddressId?: number | null;
    selectedDetailId?: number | null;
}

export interface IContactsStoreFilter {
    filterContactName?: string;
    filterDetailName?: string;
}

const ContactsPanel = () => {
    const initialUiState: IContactsStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<IContactsStoreFilter, IContactsStoreState>
            kind={"contacts"}
            initialState={{
                filters: {},
                uiState: initialUiState
            }}
        >
            <Stack gap={2}>
                <ContactsList />
                <ContactsForm />
                <Box sx={{display: 'flex', flexDirection: {xl: 'row', lg: 'column'}, gap: 0.7, width: '100%'}}>
                    <ContactsAddressContent />
                    <ContactsDetailContent />
                </Box>
            </Stack>
        </GenericPanel>
    )
}

export default ContactsPanel;
