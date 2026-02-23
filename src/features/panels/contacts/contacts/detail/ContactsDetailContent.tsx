import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {IContactsStoreState} from "@features/panels/contacts/contacts/ContactsPanel.tsx";
import {Box, Typography} from "@mui/material";
import ContactsDetailList from "@features/panels/contacts/contacts/detail/ContactsDetailList.tsx";
// import ContactsDetailForm from "@features/panels/contacts/contacts/detail/ContactsDetailForm.tsx";

const ContactsDetailContent = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IContactsStoreState>();
    const selectedContactId = useStore(state => state.uiState.selectedContactId);

    if (!selectedContactId) {
        return null;
    }

    return (
        <Box>
            <Typography variant="h6">{t("contacts.details.list")}</Typography>
            <Box sx={{display: "flex", flexDirection: "row", gap: 2, flex: 1}}>
                <ContactsDetailList />
                {/*<ContactsDetailForm />*/}
            </Box>
        </Box>
    )
}

export default ContactsDetailContent;