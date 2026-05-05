import {BaseButtonState} from "@features/panels/shared/FormButtons";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons";
import GenericPanel from "@features/panels/shared/GenericPanel";
import type {IDockviewPanelProps} from "dockview";
import type {ICustomPanelProps} from "@ui/panel/store/ICustomPanelPropst";
import ContactsAddressForm from "@features/panels/contacts/contacts/address/ContactsAddressForm";

export interface IContactsAddressStoreState extends IPanelUIState {
    selectedAddressId?: number | null;
}

export interface IContactsAddressStoreParams {
    contact_id?: number;
    address_id?: number;
    panelId?: string;
}

const ContactsAddressPanel = (props: IDockviewPanelProps<ICustomPanelProps<IContactsAddressStoreParams>>) => {
    const initialUiState: IContactsAddressStoreState = {isFormDisabled: false, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, IContactsAddressStoreState>
            disableBorders
            kind={"contactsAddress"}
            initialState={{uiState: initialUiState}}
        >
            <ContactsAddressForm {...props.params}/>
        </GenericPanel>
    )
}

export default ContactsAddressPanel;
