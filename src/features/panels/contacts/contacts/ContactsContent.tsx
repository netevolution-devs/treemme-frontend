import {Box, Stack, Typography} from "@mui/material";
import ContactsAgentsList from "@features/panels/contacts/contacts/agents/ContactsAgentsList.tsx";
import ContactsSubcontractorsList
    from "@features/panels/contacts/contacts/subcontractors/ContactsSubcontractorsList.tsx";
import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {IContactsStoreState} from "@features/panels/contacts/contacts/ContactsPanel.tsx";
import {contactsApi} from "@features/panels/contacts/contacts/api/contactsApi.ts";
import ContactsClientsList from "@features/panels/contacts/contacts/agents/ContactsClientsList.tsx";

const ContactsContent = () => {
    const {t} = useTranslation(["form", "shipping"]);

    const {useStore} = usePanel<unknown, IContactsStoreState>();
    const selectedContactId = useStore((state) => state.uiState.selectedContactId);

    const {data: contact} = contactsApi.useGetDetail(selectedContactId as number);

    return (
        <>
            {(selectedContactId && (contact?.client || contact?.supplier || contact?.agent)) && (
                <Stack sx={{width: '100%'}}>
                    <Box sx={{display: 'flex', gap: 1, width: '100%'}}>
                        {contact?.client && (
                            <Box sx={{width: '100%'}}>
                                <Typography variant="h6">{t("contacts.agents.list")}</Typography>
                                <ContactsAgentsList/>
                            </Box>
                        )}
                        {contact?.supplier && (
                            <Box sx={{width: '100%'}}>
                                <Typography variant="h6">{t("contacts.subcontractors.list")}</Typography>
                                <ContactsSubcontractorsList/>
                            </Box>
                        )}
                    </Box>
                    {contact?.agent && (
                        <Box sx={{width: '100%'}}>
                            <ContactsClientsList/>
                        </Box>
                    )}
                </Stack>
            )}
        </>
    )
}

export default ContactsContent;