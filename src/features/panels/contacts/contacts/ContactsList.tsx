import GenericList from "@features/panels/shared/GenericList.tsx";
import {useTranslation} from "react-i18next";
import {contactsApi} from "@features/panels/contacts/contacts/api/contactsApi.ts";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {IContactsStoreState} from "@features/panels/contacts/contacts/ContactsPanel.tsx";
import {useMemo} from "react";
import type {MRT_ColumnDef} from "material-react-table";
import type {IContact} from "@features/panels/contacts/contacts/api/IContact.ts";

const ContactsList = () => {
    const {t} = useTranslation(["form"]);
    const {data: contacts, isLoading} = contactsApi.useGetList();

    const {useStore} = usePanel<unknown, IContactsStoreState>();
    const selectedContactId = useStore(state => state.uiState.selectedContactId);
    const setUIState = useStore(state => state.setUIState);
    
    const columns = useMemo<MRT_ColumnDef<IContact>[]>(() => [
        {
            accessorKey: "name",
            header: t("contacts.name"),
        }
    ], [t]);
    
    return (
        <GenericList<IContact>
            data={contacts}
            isLoading={isLoading}
            columns={columns}
            selectedId={selectedContactId}
            onRowSelect={(id) => setUIState({ selectedContactId: id })}
        />
    );
};

export default ContactsList;