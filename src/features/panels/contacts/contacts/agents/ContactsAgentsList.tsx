import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext";
import type {IContactsStoreState} from "@features/panels/contacts/contacts/ContactsPanel";
import GenericList from "@features/panels/shared/GenericList";
import type {IContact} from "@features/panels/contacts/contacts/api/IContact";
import {contactsApi} from "@features/panels/contacts/contacts/api/contactsApi";
import {useMemo, useRef} from "react";
import type {MRT_ColumnDef} from "material-react-table";
import ListToolbar from "@features/panels/shared/ListToolbar";
import CustomButton from "@features/panels/shared/CustomButton";
import type {IDialogActions} from "@ui/dialog/IDialogActions";
import ContactsAgentFormDialog from "@features/panels/contacts/contacts/agents/ContactsAgentFormDialog";
import {openDialog} from "@ui/dialog/dialogHelper";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import {MenuItem, Typography} from "@mui/material";
import DeleteConfirmDialog from "@ui/dialog/confirm/DeleteConfirmDialog";
import DeleteIcon from '@mui/icons-material/Delete';
import useRemoveAgentFromContact from "@features/panels/contacts/contacts/agents/api/useRemoveAgentFromContact";

const ContactsAgentsList = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IContactsStoreState>();
    const selectedContactId = useStore(state => state.uiState.selectedContactId);
    const selectedAgentId = useStore(state => state.uiState.selectedAgentId);
    const setUIState = useStore(state => state.setUIState);

    const {data: contact, isLoading, isFetching} = contactsApi.useGetDetail(selectedContactId);
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
                disableBorder
                data={agents}
                isLoading={isLoading}
                isFetching={isFetching}
                columns={columns}
                selectedId={selectedAgentId}
                onRowSelect={(id) => setUIState({selectedAgentId: id})}
                minHeight={"150px"}
                maxHeight={"200px"}
                additionalOptions={{
                    enableTopToolbar: true,
                    renderTopToolbar: () => (
                    <ListToolbar
                            label={<Typography variant="h6">{t("contacts.agents.list")}</Typography>}
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
                    renderRowActionMenuItems: ({row, closeMenu}) => [
                        <MenuItem key="delete" onClick={() => {
                            openDialog(deleteConfirmDialogRef);
                            setUIState({selectedAgentId: row.original.id});
                            closeMenu();
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