import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext";
import type {IContactsStoreState} from "@features/panels/contacts/contacts/ContactsPanel";
import GenericList from "@features/panels/shared/GenericList";
import type {IContact} from "@features/panels/contacts/contacts/api/IContact";
import {contactsApi} from "@features/panels/contacts/contacts/api/contactsApi";
import {useMemo} from "react";
import type {MRT_ColumnDef} from "material-react-table";
import ListToolbar from "@features/panels/shared/ListToolbar";
import {Typography} from "@mui/material";

const ContactsClientsList = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IContactsStoreState>();
    const selectedContactId = useStore(state => state.uiState.selectedContactId);
    const selectedAgentId = useStore(state => state.uiState.selectedAgentId);
    const setUIState = useStore(state => state.setUIState);

    const {data: contact, isLoading, isFetching} = contactsApi.useGetDetail(selectedContactId);
    const clients = contact?.agent_clients.map((x) => x.contact).filter(Boolean) || [];

    const columns = useMemo<MRT_ColumnDef<IContact>[]>(() => [
        {
            accessorKey: "name",
            header: t("contacts.name"),
            enableColumnFilter: false
        }
    ], [t]);

    return (
        <GenericList<IContact>
            disableBorder
            data={clients}
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
                        label={<Typography variant="h6">{t("contacts.clients.list")}</Typography>}
                    />
                ),
            }}
        />
    )
}

export default ContactsClientsList;