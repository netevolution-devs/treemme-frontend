import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {IContactsStoreState} from "@features/panels/contacts/contacts/ContactsPanel.tsx";
import {contactsApi} from "@features/panels/contacts/contacts/api/contactsApi.ts";
import {useMemo} from "react";
import type {IContactDetail} from "@features/panels/contacts/contacts/api/contacts-detail/IContactDetail.tsx";
import type {MRT_ColumnDef} from "material-react-table";
import GenericList from "@features/panels/shared/GenericList.tsx";

const ContactsDetailList = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IContactsStoreState>();
    const selectedContactId = useStore(state => state.uiState.selectedContactId);
    const selectedDetailId = useStore(state => state.uiState.selectedDetailId);
    const setUIState = useStore(state => state.setUIState);

    const {data: contact, isLoading} = contactsApi.useGetDetail(selectedContactId);

    const columns = useMemo<MRT_ColumnDef<IContactDetail>[]>(() => [
        {
            accessorKey: "detail_type.code",
            header: t("form:contacts.details.types.code"),
        },
        {
            accessorKey: "detail_type.name",
            header: t("form:contacts.details.types.name"),
        },
        {
            accessorKey: "name",
            header: t("form:contacts.details.value"),
        },
        {
            accessorKey: "note",
            header: t("form:contacts.details.note")
        }
    ], [t])

    if (!selectedContactId) {
        return null;
    }

    return (
        <GenericList<IContactDetail>
            data={contact?.contact_details}
            isLoading={isLoading}
            columns={columns}
            selectedId={selectedDetailId}
            onRowSelect={(id) => setUIState({ selectedDetailId: id })}
        />
    )
}

export default ContactsDetailList;