import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {IContactsStoreState} from "@features/panels/contacts/contacts/ContactsPanel.tsx";
import {contactsApi} from "@features/panels/contacts/contacts/api/contactsApi.ts";
import {useMemo, useRef} from "react";
import type {IContactDetail} from "@features/panels/contacts/contacts/api/contacts-detail/IContactDetail.tsx";
import type {MRT_ColumnDef} from "material-react-table";
import GenericList from "@features/panels/shared/GenericList.tsx";
import ContactsDetailFormDialog from "@features/panels/contacts/contacts/detail/ContactsDetailFormDialog.tsx";
import type {IDialogActions} from "@ui/dialog/IDialogActions.ts";
import {openDialog} from "@ui/dialog/dialogHelper.ts";
import ListToolbar from "@features/panels/shared/ListToolbar.tsx";
import {NewButton} from "@features/panels/shared/CustomButton.tsx";

const ContactsDetailList = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IContactsStoreState>();
    const selectedContactId = useStore(state => state.uiState.selectedContactId);
    const selectedDetailId = useStore(state => state.uiState.selectedDetailId);
    const setUIState = useStore(state => state.setUIState);

    const {data: contact, isLoading, isFetching} = contactsApi.useGetDetail(selectedContactId);

    const columns = useMemo<MRT_ColumnDef<IContactDetail>[]>(() => [
        {
            accessorKey: "detail_type.code",
            header: t("form:contacts.details.types.code"),
        },
        {
            accessorKey: "detail_type.name",
            header: t("form:contacts.details.types.type"),
        },
        {
            accessorKey: "name",
            header: t("form:contacts.details.value"),
        },
        {
            accessorKey: "note",
            header: t("form:contacts.details.note")
        }
    ], [t]);

    const editDialogRef = useRef<IDialogActions | null>(null);

    const handleOpenCreateDialog = () => {
        setUIState({selectedDetailId: null});
        openDialog(editDialogRef);
    }

    return (
        <>
            <ContactsDetailFormDialog ref={editDialogRef}/>

            <GenericList<IContactDetail>
                data={contact?.contact_details || []}
                isLoading={isLoading}
                isFetching={isFetching}
                columns={columns}
                selectedId={selectedDetailId}
                onRowSelect={(id) => setUIState({selectedDetailId: id})}
                onRowDoubleClick={() => openDialog(editDialogRef)}
                additionalOptions={{
                    enableTopToolbar: true,
                    renderTopToolbar:
                        <ListToolbar
                            buttons={[
                                <NewButton
                                    isEnable={!!selectedContactId}
                                    onClick={() => handleOpenCreateDialog()}
                                />
                            ]}
                        />
                }}
            />
        </>
    )
}

export default ContactsDetailList;