import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";
import ContactsList from "@features/panels/contacts/contacts/ContactsList.tsx";
import ContactsForm from "@features/panels/contacts/contacts/ContactsForm.tsx";
import ContactsAddressContent from "@features/panels/contacts/contacts/address/ContactsAddressContent.tsx";
import ContactsDetailContent from "@features/panels/contacts/contacts/detail/ContactsDetailContent.tsx";
import {Stack} from "@mui/material";

export interface IContactsStoreState extends IPanelUIState {
    selectedContactId?: number | null;
    selectedAddressId?: number | null;
    selectedDetailId?: number | null;
}

const ContactsPanel = () => {
    const initialUiState: IContactsStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, IContactsStoreState>
            kind={"contacts"}
            initialState={{uiState: initialUiState}}
        >
            <Stack gap={2}>
                <ContactsList />
                <ContactsForm />
                <ContactsAddressContent />
                <ContactsDetailContent />
            </Stack>
        </GenericPanel>
    )
}

export default ContactsPanel;
