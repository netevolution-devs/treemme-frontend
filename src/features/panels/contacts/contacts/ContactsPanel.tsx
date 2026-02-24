import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";
import ContactsList from "@features/panels/contacts/contacts/ContactsList.tsx";
import ContactsForm from "@features/panels/contacts/contacts/ContactsForm.tsx";
import ContactsAddressForm from "@features/panels/contacts/contacts/address/ContactsAddressForm.tsx";
import ContactsAddressList from "@features/panels/contacts/contacts/address/ContactsAddressList.tsx";
import {Box, Typography} from "@mui/material";
import {useTranslation} from "react-i18next";

export interface IContactsStoreState extends IPanelUIState {
    selectedContactId?: number | null;
    selectedAddressId?: number | null;
}

const ContactsPanel = () => {
    const {t} = useTranslation(["form"]);
    const initialUiState: IContactsStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, IContactsStoreState>
            kind={"contacts"}
            initialState={{uiState: initialUiState}}
        >
            <ContactsList />
            <ContactsForm />

            <Typography variant="h6">{t("address")}</Typography>
            <Box sx={{display: "flex", flexDirection: "row", gap: 2}}>
                <ContactsAddressList />
                <ContactsAddressForm />
            </Box>
        </GenericPanel>
    )
}

export default ContactsPanel;
