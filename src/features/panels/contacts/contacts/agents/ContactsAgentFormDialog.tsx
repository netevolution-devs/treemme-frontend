import {forwardRef} from "react";
import type {IDialogActions} from "@ui/dialog/IDialogActions.ts";
import BaseDialog from "@ui/dialog/BaseDialog.tsx";
import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {IContactsStoreState} from "@features/panels/contacts/contacts/ContactsPanel.tsx";
import {contactsApi} from "@features/panels/contacts/contacts/api/contactsApi.ts";
import useAddAgentToContact, {
    type IAddAgentToContactPayload
} from "@features/panels/contacts/contacts/agents/api/useAddAgentToContact.ts";
import {Typography} from "@mui/material";
import GenericForm from "@features/panels/shared/GenericForm.tsx";
import CustomButton from "@features/panels/shared/CustomButton.tsx";
import SelectFieldControlled from "@ui/form/controlled/SelectFieldController.tsx";
import PersonAddIcon from '@mui/icons-material/PersonAdd';

type Props = unknown;

export type IContactAgentForm = {
    agent_id: number | null;
}

const ContactsAgentFormDialog = forwardRef<IDialogActions, Props>((_props, ref) => {
    const {t} = useTranslation(["form", "common"]);

    const {useStore} = usePanel<unknown, IContactsStoreState>();
    const selectedContactId = useStore((state) => state.uiState.selectedContactId);

    const {data: client } = contactsApi.useGetDetail(selectedContactId as number);
    const assignedAgentIds = client?.contact_agents.map(x => x.agent.id) ?? [];

    const {data: agents = []} = contactsApi.useGetList({queryParams: {type: 'agent'}});
    const filteredAgents = agents.filter(agent =>
        !assignedAgentIds.includes(agent.id) && agent.id !== selectedContactId
    );

    const {mutateAsync: addAgent, isPending} = useAddAgentToContact(selectedContactId as number) ;

    return (
        <BaseDialog ref={ref} sx={{p: 2}}>
            <Typography variant={"h5"} sx={{mb: 2}}>{t("contacts.agents.add")}</Typography>

            <GenericForm<IContactAgentForm>
                resource="contatti - contatti"
                dialogMode
                dialogRef={ref}
                disabledBasicButtons
                bypassConfirm
                selectedId={selectedContactId}
                entity={{
                    agent_id: null,
                }}
                emptyValues={{
                    agent_id: null,
                }}
                mapEntityToForm={(x) => ({agent_id: x.agent_id})}
                create={(payload) => addAgent(payload as IAddAgentToContactPayload)}
                validateBeforeSave={(v) => !!v.agent_id}
                extraButtons={[
                    <CustomButton
                        label={t("common:button.execute")}
                        color={"success"}
                        icon={<PersonAddIcon/>}
                        isSubmit
                    />
                ]}
                isSaving={isPending}
                renderFields={() => (
                    <>
                        <SelectFieldControlled<IContactAgentForm>
                            name={"agent_id"}
                            label={t("contacts.agent")}
                            options={filteredAgents.map((x) => ({label: x.name, value: x.id}))}
                            required
                        />
                    </>
                )}
            />
        </BaseDialog>
    )
});

export default ContactsAgentFormDialog;