import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext";
import type {IContactsStoreState} from "@features/panels/contacts/contacts/ContactsPanel";
import GenericList from "@features/panels/shared/GenericList";
import {contactsApi} from "@features/panels/contacts/contacts/api/contactsApi";
import {useMemo, useRef} from "react";
import type {IDialogActions} from "@ui/dialog/IDialogActions";
import {openDialog} from "@ui/dialog/dialogHelper";
import type {MRT_ColumnDef} from "material-react-table";
import type {IWorking} from "@features/panels/production/workings/api/IWorking";
import ListToolbar from "@features/panels/shared/ListToolbar";
import CustomButton from "@features/panels/shared/CustomButton";
import {Box, MenuItem, Typography} from "@mui/material";
import DeleteConfirmDialog from "@ui/dialog/confirm/DeleteConfirmDialog";
import DeleteIcon from '@mui/icons-material/Delete';
import useRemoveProcessingFromContact from "@features/panels/contacts/contacts/processings/api/useRemoveProcessingFromContact";
import DeveloperBoardIcon from '@mui/icons-material/DeveloperBoard';

import useCallablePanel from "@ui/panel/useCallablePanel";

const ContactsProcessingsList = () => {
    const {t} = useTranslation(["form", "common"]);

    const {useStore} = usePanel<unknown, IContactsStoreState>();
    const selectedContactId = useStore(state => state.uiState.selectedContactId);
    const selectedProcessingId = useStore(state => state.uiState.selectedProcessingId);
    const setUIState = useStore(state => state.setUIState);

    const {add: addSelectPanel} = useCallablePanel();

    const {data: contact, isLoading, isFetching} = contactsApi.useGetDetail(selectedContactId);
    const processings = contact?.contact_processings?.map((x) => x.processing).filter(Boolean) || [];

    const {mutateAsync: deleteProcessing} = useRemoveProcessingFromContact(selectedContactId as number);

    const columns = useMemo<MRT_ColumnDef<IWorking>[]>(() => [
        {
            accessorKey: "name",
            header: t("production.working.name"),
            enableColumnFilter: false
        }
    ], [t]);

    const handleConfirmDelete = async () => {
        await deleteProcessing({processing_id: selectedProcessingId as number});
    }

    const deleteConfirmDialogRef = useRef<IDialogActions | null>(null);

    return (
        <Box sx={{mb: 2}}>
            <DeleteConfirmDialog ref={deleteConfirmDialogRef} onConfirm={handleConfirmDelete}/>

            <GenericList<IWorking>
                disableBorder
                data={processings}
                isLoading={isLoading}
                isFetching={isFetching}
                columns={columns}
                selectedId={selectedProcessingId}
                onRowSelect={(id) => setUIState({selectedProcessingId: id})}
                minHeight={"150px"}
                maxHeight={"200px"}
                additionalOptions={{
                    enableTopToolbar: true,
                    renderTopToolbar: () => (
                        <ListToolbar
                            label={<Typography variant="h6">{t("contacts.processings.list")}</Typography>}
                            buttons={[
                                <CustomButton
                                    isEnable={!!selectedContactId}
                                    label={t("contacts.processings.add")}
                                    color={"primary"}
                                    icon={<DeveloperBoardIcon/>}
                                    onClick={() => {
                                        addSelectPanel({
                                            initialValue: `createContactsProcessings:${selectedContactId}`,
                                            extra: {
                                                selectedContactId,
                                                panelId: `createContactsProcessings:${selectedContactId}`
                                            },
                                            menu: {
                                                component: "contactsProcessings",
                                                i18nKey: "menu.contacts.add-processing"
                                            },
                                            customId: `createContactsProcessings:${selectedContactId}`
                                        });
                                    }}
                                />
                            ]}
                        />
                    ),
                    enableRowActions: true,
                    renderRowActionMenuItems: ({row, closeMenu}) => [
                        <MenuItem key="delete" onClick={() => {
                            openDialog(deleteConfirmDialogRef);
                            setUIState({selectedProcessingId: row.original.id});
                            closeMenu();
                        }}>
                            <DeleteIcon color={"error"}/>
                            {t("common:button.remove")}
                        </MenuItem>
                    ],
                }}
            />
        </Box>
    )
}

export default ContactsProcessingsList;
