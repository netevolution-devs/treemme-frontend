import {BaseButtonState} from "@features/panels/shared/FormButtons";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons";
import GenericPanel from "@features/panels/shared/GenericPanel";
import type {IDockviewPanelProps} from "dockview";
import type {ICustomPanelProps} from "@ui/panel/store/ICustomPanelPropst";
import ContactsProcessingsForm from "@features/panels/contacts/contacts/processings/ContactsProcessingsForm";

export interface IContactsProcessingsStoreState extends IPanelUIState {
    selectedProcessingId?: number | null;
}

export interface IContactsProcessingsStoreParams {
    selectedContactId?: number;
    panelId?: string;
}

const ContactsProcessingsPanel = (props: IDockviewPanelProps<ICustomPanelProps<IContactsProcessingsStoreParams>>) => {
    const initialUiState: IContactsProcessingsStoreState = {isFormDisabled: false, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, IContactsProcessingsStoreState>
            kind={"contactsProcessings"}
            initialState={{uiState: initialUiState}}
            uuid={props.api.id}
            disableBorders
        >
            <ContactsProcessingsForm {...props.params}/>
        </GenericPanel>
    )
}

export default ContactsProcessingsPanel;
