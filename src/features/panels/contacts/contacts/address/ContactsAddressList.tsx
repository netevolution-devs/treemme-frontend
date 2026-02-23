import GenericList from "@features/panels/shared/GenericList.tsx";
import type {IContactAddress} from "@features/panels/contacts/contacts/api/contacts-address/IContactAddress.ts";
import {useTranslation} from "react-i18next";
import {contactsApi} from "@features/panels/contacts/contacts/api/contactsApi.ts";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {IContactsStoreState} from "@features/panels/contacts/contacts/ContactsPanel.tsx";
import {useMemo, useRef} from "react";
import type {MRT_ColumnDef} from "material-react-table";
import ContactsAddressFormDialog from "@features/panels/contacts/contacts/address/ContactsAddressFormDialog.tsx";
import type {IDialogActions} from "@ui/dialog/IDialogActions.ts";
import {openDialog} from "@ui/dialog/dialogHelper.ts";
import ListToolbar from "@features/panels/shared/ListToolbar.tsx";
import {NewButton} from "@features/panels/shared/CustomButton.tsx";

const ContactsAddressList = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IContactsStoreState>();
    const selectedContactId = useStore(state => state.uiState.selectedContactId);
    const selectedAddressId = useStore(state => state.uiState.selectedAddressId);
    const setUIState = useStore(state => state.setUIState);

    const {data: contact, isLoading} = contactsApi.useGetDetail(selectedContactId);

    const columns = useMemo<MRT_ColumnDef<IContactAddress>[]>(() => [
        {
            accessorKey: "address_name",
            header: t("contacts.address.name")
        }
    ], [t]);

    const editDialogRef = useRef<IDialogActions | null>(null);

    const handleOpenCreateDialog = () => {
        setUIState({ selectedAddressId: null });
        openDialog(editDialogRef);
    }

    return (
        <>
            <ContactsAddressFormDialog ref={editDialogRef} />

            <GenericList<IContactAddress>
                data={contact?.contact_addresses || []}
                isLoading={isLoading}
                columns={columns}
                selectedId={selectedAddressId}
                onRowSelect={(id) => setUIState({ selectedAddressId: id })}
                onRowDoubleClick={() => openDialog(editDialogRef)}
                muiToolbarComponent={<ListToolbar buttons={[
                    <NewButton onClick={() => handleOpenCreateDialog()} />
                ]} />}
            />
        </>
    )
}

export default ContactsAddressList;