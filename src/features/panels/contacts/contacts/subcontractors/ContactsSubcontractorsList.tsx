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
import ContactsSubcontractorFormDialog from "@features/panels/contacts/contacts/subcontractors/ContactsSubcontractorFormDialog.tsx";
import {openDialog} from "@ui/dialog/dialogHelper.ts";
import {MenuItem} from "@mui/material";
import DeleteConfirmDialog from "@ui/dialog/confirm/DeleteConfirmDialog.tsx";
import DeleteIcon from '@mui/icons-material/Delete';
import useRemoveSubcontractorFromContact from "@features/panels/contacts/contacts/subcontractors/api/useRemoveSubcontractorFromContact.ts";
import DomainAddIcon from '@mui/icons-material/DomainAdd';

const ContactsSubcontractorsList = () => {
    const {t} = useTranslation(["form", "common"]);

    const {useStore} = usePanel<unknown, IContactsStoreState>();
    const selectedContactId = useStore(state => state.uiState.selectedContactId);
    const selectedSubcontractorId = useStore(state => state.uiState.selectedSubcontractorId);
    const setUIState = useStore(state => state.setUIState);

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

    const addSubcontractorDialogRef = useRef<IDialogActions | null>(null);
    const deleteConfirmDialogRef = useRef<IDialogActions | null>(null);

    return (
        <>
            <ContactsSubcontractorFormDialog ref={addSubcontractorDialogRef}/>
            <DeleteConfirmDialog ref={deleteConfirmDialogRef} onConfirm={handleConfirmDelete}/>

            <GenericList<IContact>
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
                            buttons={[
                                <CustomButton
                                    isEnable={!!selectedContactId}
                                    label={t("contacts.subcontractors.add")}
                                    color={"primary"}
                                    icon={<DomainAddIcon/>}
                                    onClick={() => {
                                        openDialog(addSubcontractorDialogRef)
                                    }}
                                />
                            ]}
                        />
                    ),
                    enableRowActions: true,
                    renderRowActionMenuItems: ({row}) => [
                        <MenuItem key="delete" onClick={() => {
                            openDialog(deleteConfirmDialogRef);
                            setUIState({selectedSubcontractorId: row.original.id});
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