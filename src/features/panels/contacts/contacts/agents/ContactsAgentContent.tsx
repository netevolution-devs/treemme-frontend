import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {IContactsStoreState} from "@features/panels/contacts/contacts/ContactsPanel.tsx";
import {Box, Typography} from "@mui/material";
import ContactsAgentsList from "@features/panels/contacts/contacts/agents/ContactsAgentsList.tsx";
import {contactsApi} from "@features/panels/contacts/contacts/api/contactsApi.ts";

const ContactsAgentContent = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IContactsStoreState>();
    const selectedContactId = useStore(state => state.uiState.selectedContactId);
    const {data: contact} = contactsApi.useGetDetail(selectedContactId);

    if (!selectedContactId || !contact?.client) {
        return null;
    }

    return (
        <Box sx={{width: '100%'}}>
            <Typography variant="h6">{t("contacts.agents.list")}</Typography>
            <ContactsAgentsList />
        </Box>
    )
}

export default ContactsAgentContent;