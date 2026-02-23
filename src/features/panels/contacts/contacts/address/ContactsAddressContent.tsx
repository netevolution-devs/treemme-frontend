import {Box, Typography} from "@mui/material";
import {useTranslation} from "react-i18next";
import ContactsAddressList from "@features/panels/contacts/contacts/address/ContactsAddressList.tsx";
import ContactsAddressForm from "@features/panels/contacts/contacts/address/ContactsAddressForm.tsx";
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
        <>
            <Typography variant="h6">{t("contacts.address.list")}</Typography>
            <Box sx={{display: "flex", flexDirection: "row", gap: 2}}>
                <ContactsAddressList />
                <ContactsAddressForm />
            </Box>
        </>
    )
}

export default ContactsAddressContent;