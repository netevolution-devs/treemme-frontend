import {Box, Typography} from "@mui/material";
import {useTranslation} from "react-i18next";
import ContactsAddressList from "@features/panels/contacts/contacts/address/ContactsAddressList.tsx";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {IContactsStoreState} from "@features/panels/contacts/contacts/ContactsPanel.tsx";

const ContactsAddressContent = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IContactsStoreState>();
    const selectedContactId = useStore(state => state.uiState.selectedContactId);

    if (!selectedContactId) {
        return null;
    }

    return (
        <Box>
            <Typography variant="h6">{t("contacts.address.list")}</Typography>
            <Box sx={{display: "flex", flexDirection: "row", gap: 2}}>
                <Box>
                    <ContactsAddressList />
                </Box>
            </Box>
        </Box>
    )
}

export default ContactsAddressContent;