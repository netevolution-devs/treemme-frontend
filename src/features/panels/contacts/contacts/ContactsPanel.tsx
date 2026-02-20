import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";
import ContactsList from "@features/panels/contacts/contacts/ContactsList.tsx";

export interface IContactsStoreState extends IPanelUIState {
    selectedContactId?: number | null;
}

const ContactsPanel = () => {
    const initialUiState: IContactsStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, IContactsStoreState>
            kind={"contacts"}
            initialState={{uiState: initialUiState}}
        >
            <ContactsList />
            <div>Form placeholder for Contacts</div>
        </GenericPanel>
    )
}

export default ContactsPanel;
