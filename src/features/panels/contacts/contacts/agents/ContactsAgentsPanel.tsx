import {BaseButtonState} from "@features/panels/shared/FormButtons";
import type {IPanelUIState} from "@features/panels/shared/hooks/usePanelFormButtons";
import GenericPanel from "@features/panels/shared/GenericPanel";
import type {IDockviewPanelProps} from "dockview";
import type {ICustomPanelProps} from "@ui/panel/store/ICustomPanelPropst";
import ContactsAgentsForm from "@features/panels/contacts/contacts/agents/ContactsAgentsForm";

export interface IContactsAgentsStoreState extends IPanelUIState {
    selectedAgentId?: number | null;
}

export interface IContactsAgentsStoreParams {
    selectedContactId?: number;
    panelId?: string;
}

const ContactsAgentsPanel = (props: IDockviewPanelProps<ICustomPanelProps<IContactsAgentsStoreParams>>) => {
    const initialUiState: IContactsAgentsStoreState = {isFormDisabled: false, buttonsState: BaseButtonState};

    return (
        <GenericPanel<unknown, IContactsAgentsStoreState>
            kind={"contactsAgents"}
            initialState={{uiState: initialUiState}}
            disableBorders
        >
            <ContactsAgentsForm {...props.params}/>
        </GenericPanel>
    )
}

export default ContactsAgentsPanel;
