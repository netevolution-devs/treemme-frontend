import GenericList from "@features/panels/shared/GenericList.tsx";
import {useTranslation} from "react-i18next";
import {contactsApi} from "@features/panels/contacts/contacts/api/contactsApi.ts";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {IContactsStoreFilter, IContactsStoreState} from "@features/panels/contacts/contacts/ContactsPanel.tsx";
import {useMemo} from "react";
import type {MRT_ColumnDef} from "material-react-table";
import type {IContact} from "@features/panels/contacts/contacts/api/IContact.ts";
import ListToolbar from "@features/panels/shared/ListToolbar.tsx";
import TextFieldFilter from "@ui/form/filters/TextFieldFilter.tsx";
import {cleanFilters} from "@ui/form/filters/useCleanFilters.ts";

const ContactsList = () => {
    const {t} = useTranslation(["form"]);
    const {useStore} = usePanel<IContactsStoreFilter, IContactsStoreState>();

    const selectedContactId = useStore(state => state.uiState.selectedContactId);
    const setUIState = useStore(state => state.setUIState);
    const setFilters = useStore(state => state.setFilters);

    const filterContactName = useStore(state => state.filters.filterContactName);
    const filterDetailName = useStore(state => state.filters.filterDetailName);

    const queryParams = useMemo(() => cleanFilters(
            {
                contact_name: filterContactName,
                detail_name: filterDetailName,
            }
        ),
        [filterContactName, filterDetailName]
    );

    const {data: contacts, isLoading} = contactsApi.useGetList({queryParams});

    const columns = useMemo<MRT_ColumnDef<IContact>[]>(() => [
        {
            accessorKey: "name",
            header: t("contacts.name"),
            enableColumnFilter: false
        }
    ], [t]);

    return (
        <GenericList<IContact>
            data={contacts}
            isLoading={isLoading}
            columns={columns}
            selectedId={selectedContactId}
            onRowSelect={(id) => setUIState({selectedContactId: id})}
            additionalOptions={{
                enableTopToolbar: true,
                renderTopToolbar:
                    <ListToolbar
                        filters={[
                            <TextFieldFilter
                                key="f-contact_name"
                                label={t("contacts.filters.name")}
                                value={filterContactName}
                                onFilterChange={(val) => setFilters({filterContactName: val as string})}
                            />,
                            <TextFieldFilter
                                key="f-detail_name"
                                label={t("contacts.filters.detail")}
                                value={filterDetailName}
                                onFilterChange={(val) => setFilters({filterDetailName: val as string})}
                            />,
                        ]}
                    />
            }}
        />
    );
};

export default ContactsList;