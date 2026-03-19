import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";
import ContactsList from "@features/panels/contacts/contacts/ContactsList.tsx";
import ContactsForm from "@features/panels/contacts/contacts/ContactsForm.tsx";
import {Box, Stack, Typography} from "@mui/material";
import ContactsAddressList from "@features/panels/contacts/contacts/address/ContactsAddressList.tsx";
import {useTranslation} from "react-i18next";
import ContactsDetailList from "@features/panels/contacts/contacts/detail/ContactsDetailList.tsx";
import ContactsContent from "@features/panels/contacts/contacts/ContactsContent.tsx";
import type {IDockviewPanelProps} from "dockview";
import type {ICustomPanelProps} from "@ui/panel/store/ICustomPanelPropst.ts";

export interface IContactsStoreState extends IPanelUIState {
    selectedContactId?: number | null;
    selectedAddressId?: number | null;
    selectedDetailId?: number | null;
    selectedAgentId?: number | null;
    selectedSubcontractorId?: number | null;
}

export interface IContactsStoreFilter {
    filterContactName?: string;
    filterDetailName?: string;
}

export interface IContactsStoreParams {
    supplier?: boolean;
}

const ContactsPanel = (props: IDockviewPanelProps<ICustomPanelProps<IContactsStoreParams>>) => {
    const {t} = useTranslation(["form"]);
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
                <Box sx={{display: 'flex', gap: 2, width: '100%'}}>
                    <ContactsForm {...props.params}/>
                    <ContactsContent />
                </Box>
                <Box sx={{
                    display: 'flex',
                    flexDirection: {xs: 'column', lg: 'row'},
                    flexWrap: 'wrap',
                    gap: 1,
                    width: '100%'
                }}>
                    <Box sx={{flex: '1 1 300px', minWidth: 0}}>
                        <Typography variant="h6">{t("contacts.address.list")}</Typography>
                        <ContactsAddressList />
                    </Box>
                    <Box sx={{flex: '1 1 300px', minWidth: 0}}>
                        <Typography variant="h6">{t("contacts.details.list")}</Typography>
                        <ContactsDetailList />
                    </Box>
                </Box>
            </Stack>
        </GenericPanel>
    )
}

export default ContactsPanel;
