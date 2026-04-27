import {BaseButtonState} from "@features/panels/shared/FormButtons";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons";
import GenericPanel from "@features/panels/shared/GenericPanel";
import type {IDockviewPanelProps} from "dockview";
import type {ICustomPanelProps} from "@ui/panel/store/ICustomPanelPropst";
import ContactsSubcontractorsForm from "@features/panels/contacts/contacts/subcontractors/ContactsSubcontractorsForm";

export interface IContactsSubcontractorsStoreState extends IPanelUIState {
    selectedSubcontractorId?: number | null;
}

export interface IContactsSubcontractorsStoreParams {
    selectedContactId?: number;
    panelId?: string;
}

const ContactsSubcontractorsPanel = (props: IDockviewPanelProps<ICustomPanelProps<IContactsSubcontractorsStoreParams>>) => {
    const initialUiState: IContactsSubcontractorsStoreState = {isFormDisabled: false, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, IContactsSubcontractorsStoreState>
            kind={"contactsSubcontractors"}
            initialState={{uiState: initialUiState}}
            disableBorders
        >
            <ContactsSubcontractorsForm {...props.params}/>
        </GenericPanel>
    )
}

export default ContactsSubcontractorsPanel;
