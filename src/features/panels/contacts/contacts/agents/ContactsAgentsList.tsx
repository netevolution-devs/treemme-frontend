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
import {MenuItem} from "@mui/material";
import DeleteConfirmDialog from "@ui/dialog/confirm/DeleteConfirmDialog.tsx";
import DeleteIcon from '@mui/icons-material/Delete';
import useRemoveAgentFromContact from "@features/panels/contacts/contacts/agents/api/useRemoveAgentFromContact.ts";

const ContactsAgentsList = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IContactsStoreState>();
    const selectedContactId = useStore(state => state.uiState.selectedContactId);
    const selectedAgentId = useStore(state => state.uiState.selectedAgentId);
    const setUIState = useStore(state => state.setUIState);

    const {data: contact, isLoading} = contactsApi.useGetDetail(selectedContactId);
    const agents = contact?.contact_agents.map((x) => x.agent) || [];

    const {mutateAsync: deleteAgent} = useRemoveAgentFromContact(selectedContactId as number);

    const columns = useMemo<MRT_ColumnDef<IContact>[]>(() => [
        {
            accessorKey: "name",
            header: t("contacts.name"),
            enableColumnFilter: false
        }
    ], [t]);

    const handleConfirmDelete = async () => {
        console.log("Deleting agent");
        await deleteAgent({agent_id: selectedAgentId as number});
    }

    const addAgentDialogRef = useRef<IDialogActions | null>(null);
    const deleteConfirmDialogRef = useRef<IDialogActions | null>(null);

    return (
        <>
            <ContactsAgentFormDialog ref={addAgentDialogRef}/>
            <DeleteConfirmDialog ref={deleteConfirmDialogRef} onConfirm={handleConfirmDelete}/>

            <GenericList<IContact>
                data={agents}
                isLoading={isLoading}
                columns={columns}
                selectedId={selectedAgentId}
                onRowSelect={(id) => setUIState({selectedAgentId: id})}
                minHeight={"150px"}
                maxHeight={"200px"}
                additionalOptions={{
                    enableTopToolbar: true,
                    renderTopToolbar: () => (
                        <ListToolbar
                            buttons={[
                                <CustomButton
                                    isEnable={!!selectedContactId}
                                    label={t("contacts.agents.add")}
                                    color={"primary"}
                                    icon={<PersonAddIcon/>}
                                    onClick={() => {
                                        openDialog(addAgentDialogRef)
                                    }}
                                />
                            ]}
                        />
                    ),
                    enableRowActions: true,
                    renderRowActionMenuItems: ({row}) => [
                        <MenuItem key="delete" onClick={() => {
                            openDialog(deleteConfirmDialogRef);
                            setUIState({selectedAgentId: row.original.id});
                        }}>
                            <DeleteIcon color={"error"}/>
                            {t("common:button.remove")}
                        </MenuItem>
                    ],
                }}
            />
        </>
    )
}

export default ContactsAgentsList;