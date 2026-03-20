import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {
    IDeliveryNotesStoreFilter,
    IDeliveryNotesStoreState
} from "@features/panels/shipping-invoicing/delivery-notes/DeliveryNotesPanel.tsx";
import {deliveryNoteApi} from "@features/panels/shipping-invoicing/delivery-notes/api/deliveryNoteApi.ts";
import {useMemo} from "react";
import type {MRT_ColumnDef} from "material-react-table";
import type {IDeliveryNote} from "@features/panels/shipping-invoicing/delivery-notes/api/IDeliveryNote.ts";
import GenericList from "@features/panels/shared/GenericList.tsx";
import ListToolbar from "@features/panels/shared/ListToolbar.tsx";
import SelectFieldFilter from "@ui/form/filters/SelectFieldFilter.tsx";
import {cleanFilters} from "@ui/form/filters/useCleanFilters.ts";
import {contactsApi} from "@features/panels/contacts/contacts/api/contactsApi.ts";
import DateFieldRangeFilter from "@ui/form/filters/DateFieldRangeFilter.tsx";
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

    const {data: deliveryNotes = [], isLoading} = deliveryNoteApi.useGetList({queryParams});
    const {data: subcontractors = []} = contactsApi.useGetList({queryParams: {type: "subcontractor"}});

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
                                label={t("shipping.subcontractor")}
                                value={filterSubcontractorId}
                                options={subcontractors.map(s => ({value: s.id, label: s.name}))}
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