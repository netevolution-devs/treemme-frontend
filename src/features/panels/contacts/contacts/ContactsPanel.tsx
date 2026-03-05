import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";
import ContactsList from "@features/panels/contacts/contacts/ContactsList.tsx";
import ContactsForm from "@features/panels/contacts/contacts/ContactsForm.tsx";
import ContactsAddressContent from "@features/panels/contacts/contacts/address/ContactsAddressContent.tsx";
import ContactsDetailContent from "@features/panels/contacts/contacts/detail/ContactsDetailContent.tsx";
import {Box, Stack} from "@mui/material";
import ContactsAgentContent from "@features/panels/contacts/contacts/agents/ContactsAgentContent.tsx";

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
                <ContactsList/>
                <ContactsForm/>
                <Box sx={{
                    display: 'flex',
                    flexDirection: {xs: 'column', xl: 'row'},
                    flexWrap: 'wrap',
                    gap: 1,
                    width: '100%'
                }}>
                    <Box sx={{flex: '1 1 450px', minWidth: 0}}>
                        <ContactsAddressContent/>
                    </Box>
                    <Box sx={{flex: '1 1 450px', minWidth: 0}}>
                        <ContactsDetailContent/>
                    </Box>
                </Box>
                <Box>
                    <ContactsAgentContent/>
                </Box>
            </Stack>
        </GenericPanel>
    )
}

export default ContactsPanel;
