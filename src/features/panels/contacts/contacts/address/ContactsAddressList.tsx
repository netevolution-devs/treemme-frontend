import GenericList from "@features/panels/shared/GenericList.tsx";
import type {IContactAddress} from "@features/panels/contacts/contacts/api/contacts-address/IContactAddress.ts";
import {useTranslation} from "react-i18next";
import {contactsApi} from "@features/panels/contacts/contacts/api/contactsApi.ts";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {IContactsStoreState} from "@features/panels/contacts/contacts/ContactsPanel.tsx";
import {useMemo} from "react";
import type {MRT_ColumnDef} from "material-react-table";

const ContactsAddressList = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IContactsStoreState>();
    const selectedContactId = useStore(state => state.uiState.selectedContactId);
    const selectedAddressId = useStore(state => state.uiState.selectedAddressId);
    const setUIState = useStore(state => state.setUIState);

    const {data: contact, isLoading} = contactsApi.useGetDetail(selectedContactId);

    const columns = useMemo<MRT_ColumnDef<IContactAddress>[]>(() => [
        {
            accessorKey: "address_note",
            header: t("contacts.address.name")
        }
    ], [t]);

    if (!selectedContactId) {
        return null;
    }

    return (
        <GenericList<IContactAddress>
            data={contact?.contact_addresses || []}
            isLoading={isLoading}
            columns={columns}
            selectedId={selectedAddressId}
            onRowSelect={(id) => setUIState({ selectedAddressId: id })}
        />
    )
}

export default ContactsAddressList;