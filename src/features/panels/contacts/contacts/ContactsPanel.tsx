import {BaseButtonState} from "@features/panels/shared/FormButtons.tsx";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons.ts";
import GenericPanel from "@features/panels/shared/GenericPanel.tsx";
import ContactsList from "@features/panels/contacts/contacts/ContactsList.tsx";
import ContactsForm from "@features/panels/contacts/contacts/ContactsForm.tsx";
import {Box} from "@mui/material";
import ContactsAddressList from "@features/panels/contacts/contacts/address/ContactsAddressList.tsx";
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
    selectedSupplierId?: number | null;
}

export interface IContactsStoreFilter {
    filterContactName?: string;
    filterDetailName?: string;
}

export interface IContactsStoreParams {
    supplier?: boolean;
    client?: boolean;
}

const ContactsPanel = (props: IDockviewPanelProps<ICustomPanelProps<IContactsStoreParams>>) => {
    const initialUiState: IContactsStoreState = {isFormDisabled: true, buttonsState: BaseButtonState};

    return (
        <GenericPanel<IContactsStoreFilter, IContactsStoreState>
            kind={"contacts"}
            initialState={{
                filters: {},
                uiState: initialUiState
            }}
            listComponent={
                <ContactsList/>
            }
        >
            <>
                <Box sx={{display: 'flex', gap: 1, width: '100%'}}>
                    <ContactsForm {...props.params}/>
                    <ContactsContent/>
                </Box>
                <Box sx={{
                    display: 'flex',
                    flexDirection: {xs: 'column', lg: 'row'},
                    flexWrap: 'wrap',
                    gap: 0.5,
                    width: '100%',
                    mb: 1.5
                }}>
                    <Box sx={{flex: '1 1 300px', minWidth: 0}}>
                        <ContactsAddressList/>
                    </Box>
                    <Box sx={{flex: '1 1 300px', minWidth: 0}}>
                        <ContactsDetailList/>
                    </Box>
                </Box>
            </>
        </GenericPanel>
    )
}

export default ContactsPanel;
