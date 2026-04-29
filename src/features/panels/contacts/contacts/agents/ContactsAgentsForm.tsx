import {useTranslation} from "react-i18next";
import GenericForm from "@features/panels/shared/GenericForm";
import SelectFieldControlled from "@ui/form/controlled/SelectFieldController";
import {useEffect} from "react";
import {contactsApi} from "@features/panels/contacts/contacts/api/contactsApi";
import useAddAgentToContact, {
    type IAddAgentToContactPayload
} from "@features/panels/contacts/contacts/agents/api/useAddAgentToContact";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CustomButton from "@features/panels/shared/CustomButton";
import type {ICustomPanelFormProps} from "@ui/panel/store/ICustomPanelPropst";
import {usePanelFormButtons} from "@features/panels/shared/hooks/usePanelFormButtons";
import {usePanelFormLogic} from "@ui/panel/usePanelFormLogin";
import type {
    IContactsAgentsStoreParams,
    IContactsAgentsStoreState
} from "@features/panels/contacts/contacts/agents/ContactsAgentsPanel";
import useCallablePanel from "@ui/panel/useCallablePanel";
import useSubscribePanel from "@ui/panel/useSubscribePanel";

export type IContactAgentForm = {
    agent_id: number | null;
}

const ContactsAgentsForm = ({
                                 initialName,
                                 onSuccess,
                                 extra
                             }: ICustomPanelFormProps<IContactsAgentsStoreParams>) => {
    const {t} = useTranslation(["common"]);
    const selectedContactId = extra?.selectedContactId ?? 0;
    const floatingPanelUUID = extra?.panelId as string;

    const {setFormState} = usePanelFormButtons();

    const {handlePanelSuccess} = usePanelFormLogic({
        initialName,
        selectedId: null,
        onSuccess,
        setFormState
    });

    const {mutateAsync: addAgent, isPending} = useAddAgentToContact(selectedContactId);

    useEffect(() => {
        if (floatingPanelUUID?.includes("create")) {
            setFormState("new");
        }
    }, [floatingPanelUUID, setFormState]);

    return (
        <GenericForm<IContactAgentForm, IContactAgentForm, IContactsAgentsStoreState>
            resource="contatti - contatti"
            floatingPanelMode
            floatingPanelUUID={extra?.panelId as string}
            disabledBasicButtons
            disableCreateButton
            disableEditButton
            bypassConfirm
            selectedId={null}
            entity={{
                agent_id: null,
            }}
            emptyValues={{
                agent_id: null,
            }}
            mapEntityToForm={(x) => ({agent_id: x.agent_id})}
            create={async (payload) => {
                await addAgent(payload as IAddAgentToContactPayload);
                handlePanelSuccess({id: 0});
            }}
            validateBeforeSave={(v) => !!v.agent_id}
            extraButtons={[
                <CustomButton
                    key="submit-agent"
                    label={t("common:button.execute")}
                    color={"success"}
                    icon={<PersonAddIcon/>}
                    isSubmit
                />
            ]}
            isSaving={isPending}
            renderFields={() => <ContactsAgentsFormFields selectedContactId={selectedContactId}/>}
        />
    );
};

interface IContactsAgentsFormProps {
    selectedContactId: number;
}

const ContactsAgentsFormFields = ({selectedContactId}: IContactsAgentsFormProps) => {
    const {t} = useTranslation(["form"]);

    const {data: client} = contactsApi.useGetDetail(selectedContactId);
    const assignedAgentIds = client?.contact_agents.map(x => x.agent.id) ?? [];

    const {data: agents = []} = contactsApi.useGetList({queryParams: {type: 'agent'}});
    const filteredAgents = agents.filter(agent =>
        !assignedAgentIds.includes(agent.id) && agent.id !== selectedContactId
    );

    const {add: addSelectPanel} = useCallablePanel();

    useSubscribePanel<IContactAgentForm>({
        formKey: "agent_id",
        dependencyKey: "contacts"
    })

    return (
        <>
            <SelectFieldControlled<IContactAgentForm>
                name={"agent_id"}
                label={t("contacts.agent")}
                options={filteredAgents.map((x) => ({label: x.name, value: x.id}))}
                required
            onNoOptionsMatch={(input) => {
                addSelectPanel({
                    extra: {
                        agent: true
                    },
                    initialValue: input,
                    menu: {
                        component: "contacts",
                        i18nKey: "menu.contacts.contacts"
                    },
                    customId: input
                })
            }}
            />
        </>
    )
}

export default ContactsAgentsForm;
