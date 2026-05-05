import {BaseButtonState} from "@features/panels/shared/FormButtons";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons";
import GenericPanel from "@features/panels/shared/GenericPanel";
import type {IDockviewPanelProps} from "dockview";
import type {ICustomPanelProps} from "@ui/panel/store/ICustomPanelPropst";
import ContactsDetailForm from "@features/panels/contacts/contacts/detail/ContactsDetailForm";

export interface IContactsDetailStoreState extends IPanelUIState {
    selectedDetailId?: number | null;
}

export interface IContactsDetailStoreParams {
    contact_id?: number;
    detail_id?: number;
    panelId?: string;
}

const ContactsDetailPanel = (props: IDockviewPanelProps<ICustomPanelProps<IContactsDetailStoreParams>>) => {
    const initialUiState: IContactsDetailStoreState = {isFormDisabled: false, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, IContactsDetailStoreState>
            disableBorders
            kind={"contactsDetail"}
            uuid={props.api.id}
            initialState={{uiState: initialUiState}}
        >
            <ContactsDetailForm {...props.params}/>
        </GenericPanel>
    )
}

export default ContactsDetailPanel;
