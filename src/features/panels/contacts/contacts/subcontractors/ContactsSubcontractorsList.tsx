import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext";
import type {IContactsStoreState} from "@features/panels/contacts/contacts/ContactsPanel";
import GenericList from "@features/panels/shared/GenericList";
import type {IContact} from "@features/panels/contacts/contacts/api/IContact";
import {contactsApi} from "@features/panels/contacts/contacts/api/contactsApi";
import {useMemo, useRef} from "react";
import type {IDialogActions} from "@ui/dialog/IDialogActions";
import {openDialog} from "@ui/dialog/dialogHelper";
import type {MRT_ColumnDef} from "material-react-table";
import ListToolbar from "@features/panels/shared/ListToolbar";
import CustomButton from "@features/panels/shared/CustomButton";
import {MenuItem, Typography} from "@mui/material";
import DeleteConfirmDialog from "@ui/dialog/confirm/DeleteConfirmDialog";
import DeleteIcon from '@mui/icons-material/Delete';
import useRemoveSubcontractorFromContact from "@features/panels/contacts/contacts/subcontractors/api/useRemoveSubcontractorFromContact";
import DomainAddIcon from '@mui/icons-material/DomainAdd';

import useCallablePanel from "@ui/panel/useCallablePanel";

const ContactsSubcontractorsList = () => {
    const {t} = useTranslation(["form", "common"]);

    const {useStore} = usePanel<unknown, IContactsStoreState>();
    const selectedContactId = useStore(state => state.uiState.selectedContactId);
    const selectedSubcontractorId = useStore(state => state.uiState.selectedSubcontractorId);
    const setUIState = useStore(state => state.setUIState);

    const {add: addSelectPanel} = useCallablePanel();

    const {data: contact, isLoading, isFetching} = contactsApi.useGetDetail(selectedContactId);
    const subcontractors = contact?.contact_subcontractors?.map((x) => x.subcontractor).filter(Boolean) || [];

    const {mutateAsync: deleteSubcontractor} = useRemoveSubcontractorFromContact(selectedContactId as number);

    const columns = useMemo<MRT_ColumnDef<IContact>[]>(() => [
        {
            accessorKey: "name",
            header: t("shipping.subcontractor"),
            enableColumnFilter: false
        }
    ], [t]);

    const handleConfirmDelete = async () => {
        await deleteSubcontractor({subcontractor_id: selectedSubcontractorId as number});
    }

    const deleteConfirmDialogRef = useRef<IDialogActions | null>(null);

    return (
        <>
            <DeleteConfirmDialog ref={deleteConfirmDialogRef} onConfirm={handleConfirmDelete}/>

            <GenericList<IContact>
                disableBorder
                data={subcontractors}
                isLoading={isLoading}
                isFetching={isFetching}
                columns={columns}
                selectedId={selectedSubcontractorId}
                onRowSelect={(id) => setUIState({selectedSubcontractorId: id})}
                minHeight={"150px"}
                maxHeight={"200px"}
                additionalOptions={{
                    enableTopToolbar: true,
                    renderTopToolbar: () => (
                        <ListToolbar
                            label={<Typography variant="h6">{t("contacts.subcontractors.list")}</Typography>}
                            buttons={[
                                <CustomButton
                                    isEnable={!!selectedContactId}
                                    label={t("contacts.subcontractors.add")}
                                    color={"primary"}
                                    icon={<DomainAddIcon/>}
                                    onClick={() => {
                                        addSelectPanel({
                                            initialValue: `createContactsSubcontractors:${selectedContactId}`,
                                            extra: {
                                                selectedContactId,
                                                panelId: `createContactsSubcontractors:${selectedContactId}`
                                            },
                                            menu: {
                                                component: "contactsSubcontractors",
                                                i18nKey: "menu.contacts.add-subcontractor"
                                            },
                                            customId: `createContactsSubcontractors:${selectedContactId}`
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
                            setUIState({selectedSubcontractorId: row.original.id});
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

export default ContactsSubcontractorsList;