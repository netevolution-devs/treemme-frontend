import {Box, Stack} from "@mui/material";
import ContactsAgentsList from "@features/panels/contacts/contacts/agents/ContactsAgentsList.tsx";
import ContactsSubcontractorsList
    from "@features/panels/contacts/contacts/subcontractors/ContactsSubcontractorsList.tsx";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {IContactsStoreState} from "@features/panels/contacts/contacts/ContactsPanel.tsx";
import {contactsApi} from "@features/panels/contacts/contacts/api/contactsApi.ts";
import ContactsClientsList from "@features/panels/contacts/contacts/agents/ContactsClientsList.tsx";
import ContactsSupplierList from "@features/panels/contacts/contacts/subcontractors/ContactsSupplierList.tsx";

const ContactsContent = () => {
    const {useStore} = usePanel<unknown, IContactsStoreState>();
    const selectedContactId = useStore((state) => state.uiState.selectedContactId);

    const {data: contact} = contactsApi.useGetDetail(selectedContactId as number);

    return (
        <>
            {(selectedContactId && (contact?.client || contact?.supplier || contact?.agent || contact?.subcontractor)) && (
                <Stack sx={{width: '100%', gap: 1}}> {/* Aggiunto gap qui invece di mb manuali */}
                    <Box sx={{
                        display: 'flex',
                        flexDirection: {xs: 'column', md: 'row'},
                        gap: 1,
                        width: '100%'
                    }}>
                        {contact?.client && (
                            <Box sx={{width: '100%', height: '100%'}}>
                                <ContactsAgentsList/>
                            </Box>
                        )}
                        {contact?.supplier && (
                            <Box sx={{width: '100%', height: '100%'}}>
                                <ContactsSubcontractorsList/>
                            </Box>
                        )}
                    </Box>
                    {contact?.agent && (
                        <Box sx={{width: '100%', height: '100%'}}>
                            <ContactsClientsList/>
                        </Box>
                    )}
                    {contact?.subcontractor && (
                        <Box sx={{width: '100%', height: '100%'}}>
                            <ContactsSupplierList/>
                        </Box>
                    )}
                </Stack>
            )}
        </>
    )
}

export default ContactsContent;