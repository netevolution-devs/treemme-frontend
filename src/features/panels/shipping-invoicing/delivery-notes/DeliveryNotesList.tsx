import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext";
import type {
    IDeliveryNotesStoreFilter,
    IDeliveryNotesStoreState
} from "@features/panels/shipping-invoicing/delivery-notes/DeliveryNotesPanel";
import {deliveryNoteApi} from "@features/panels/shipping-invoicing/delivery-notes/api/deliveryNoteApi";
import {useMemo} from "react";
import type {MRT_ColumnDef} from "material-react-table";
import type {IDeliveryNote} from "@features/panels/shipping-invoicing/delivery-notes/api/IDeliveryNote";
import GenericList from "@features/panels/shared/GenericList";
import ListToolbar from "@features/panels/shared/ListToolbar";
import SelectFieldFilter from "@ui/form/filters/SelectFieldFilter";
import {cleanFilters} from "@ui/form/filters/useCleanFilters";
import {contactsApi} from "@features/panels/contacts/contacts/api/contactsApi";
import DateFieldRangeFilter from "@ui/form/filters/DateFieldRangeFilter";
import dayjs from "dayjs";

const DeliveryNotesList = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<IDeliveryNotesStoreFilter, IDeliveryNotesStoreState>();
    const selectedDeliveryNoteId = useStore((state) => state.uiState.selectedDeliveryNoteId);
    const setUIState = useStore((state) => state.setUIState);

    const filterSubcontractorId = useStore((state) => state.filters.filterSubcontractorId);
    const filterStartDate = useStore((state) => state.filters.filterStartDate);
    const filterEndDate = useStore((state) => state.filters.filterEndDate);
    const setFilters = useStore((state) => state.setFilters);

    const queryParams = useMemo(() => cleanFilters(
        {
            subcontractor_id: filterSubcontractorId as number,
            start_date: filterStartDate,
            end_date: filterEndDate,
        }
    ), [filterSubcontractorId, filterStartDate, filterEndDate]);

    const {data: deliveryNotes = [], isLoading, isFetching} = deliveryNoteApi.useGetList({queryParams});
    const {data: subcontractors = []} = contactsApi.useGetList({queryParams: {type: "subcontractor"}});
    const {data: clients = []} = contactsApi.useGetList({queryParams: {type: "client"}});

    const contacts = [
            ...subcontractors,
            ...clients
        ].filter(
        (contact, index, self) => self.findIndex(c => c.id === contact.id) === index
    );

    const columns = useMemo<MRT_ColumnDef<IDeliveryNote>[]>(() => [
        {
            accessorKey: "ddt_number",
            header: t("shipping.ddt_number"),
        },
        {
            accessorKey: "reason.name",
            header: t("shipping.reason"),
        },
        {
            accessorKey: "subcontractor.name",
            header: t("shipping.subcontractor"),
        },
        {
            accessorKey: "ddt_date",
            header: t("shipping.ddt_date"),
            Cell: ({row}) => dayjs(row.original.ddt_date).format("DD/MM/YYYY"),
        }
    ], [t]);

    return (
        <GenericList<IDeliveryNote>
            data={deliveryNotes}
            isLoading={isLoading}
            isFetching={isFetching}
            columns={columns}
            selectedId={selectedDeliveryNoteId}
            onRowSelect={(id) => setUIState({selectedDeliveryNoteId: id})}
            additionalOptions={{
                enableTopToolbar: true,
                renderTopToolbar: () => (
                    <ListToolbar
                        filters={[
                            <SelectFieldFilter
                                key={"f-subcontractor"}
                                label={t("shipping.subcontractor_clients")}
                                value={filterSubcontractorId}
                                options={contacts.map(s => ({value: s.id, label: s.name}))}
                                onFilterChange={(value) => setFilters({filterSubcontractorId: value as number})}
                            />,
                            <DateFieldRangeFilter
                                key={"f-date-range"}
                                startValue={filterStartDate}
                                endValue={filterEndDate}
                                onStartFilterChange={(value) => setFilters({filterStartDate: value as string})}
                                onEndFilterChange={(value) => setFilters({filterEndDate: value as string})}
                                startLabel={t("shipping.date_start")}
                                endLabel={t("shipping.date_end")}
                            />
                        ]}
                    />
                )
            }}
        />
    )
}

export default DeliveryNotesList;