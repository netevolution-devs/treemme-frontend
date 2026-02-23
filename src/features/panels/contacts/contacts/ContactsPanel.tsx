import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";
import ContactsList from "@features/panels/contacts/contacts/ContactsList.tsx";
import ContactsForm from "@features/panels/contacts/contacts/ContactsForm.tsx";
import ContactsAddressContent from "@features/panels/contacts/contacts/address/ContactsAddressContent.tsx";

export interface IContactsStoreState extends IPanelUIState {
    selectedContactId?: number | null;
    selectedAddressId?: number | null;
}

const ContactsPanel = () => {
    const initialUiState: IContactsStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, IContactsStoreState>
            kind={"contacts"}
            initialState={{uiState: initialUiState}}
        >
            <ContactsList />
            <ContactsForm />
            <ContactsAddressContent />
        </GenericPanel>
    )
}

export default ContactsPanel;
