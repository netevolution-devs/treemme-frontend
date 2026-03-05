import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {IContactsStoreState} from "@features/panels/contacts/contacts/ContactsPanel.tsx";
import GenericList from "@features/panels/shared/GenericList.tsx";
import type {IContact} from "@features/panels/contacts/contacts/api/IContact.ts";
import {contactsApi} from "@features/panels/contacts/contacts/api/contactsApi.ts";
import {useMemo, useRef} from "react";
import type {MRT_ColumnDef} from "material-react-table";
import ListToolbar from "@features/panels/shared/ListToolbar.tsx";
import CustomButton from "@features/panels/shared/CustomButton.tsx";
import type {IDialogActions} from "@ui/dialog/IDialogActions.ts";
import ContactsAgentFormDialog from "@features/panels/contacts/contacts/agents/ContactsAgentFormDialog.tsx";
import {openDialog} from "@ui/dialog/dialogHelper.ts";
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const ContactsAgentsList = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IContactsStoreState>();
    const selectedContactId = useStore(state => state.uiState.selectedContactId);

    const {data: contact, isLoading} = contactsApi.useGetDetail(selectedContactId);
    const agents = contact?.contact_agents || [];

    const columns = useMemo<MRT_ColumnDef<IContact>[]>(() => [
        {
            accessorKey: "name",
            header: t("contacts.name"),
            enableColumnFilter: false
        }
    ], [t]);

    const addAgentDialogRef = useRef<IDialogActions | null>(null);

    return (
        <>
            <ContactsAgentFormDialog ref={addAgentDialogRef}/>

            <GenericList<IContact>
                data={agents}
                isLoading={isLoading}
                columns={columns}
                additionalOptions={{
                    enableTopToolbar: true,
                    renderTopToolbar: () => (
                        <ListToolbar
                            buttons={[
                                <CustomButton
                                    label={t("contacts.agents.add")}
                                    color={"primary"}
                                    icon={<PersonAddIcon/>}
                                    onClick={() => {openDialog(addAgentDialogRef)}}
                                />
                            ]}
                        />
                    )
                }}
            />
        </>
    )
}

export default ContactsAgentsList;