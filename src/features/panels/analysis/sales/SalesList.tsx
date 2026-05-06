import useGetDDTRowSold, {type IDDTRowSold} from "@features/panels/analysis/sales/api/useGetDDTRowSold";
import GenericList from "@features/panels/shared/GenericList";
import {useMemo} from "react";
import type {MRT_ColumnDef} from "material-react-table";
import {useTranslation} from "react-i18next";
import dayjs from "dayjs";
import {usePanel} from "@ui/panel/PanelContext";
import type {ISalesStoreFilter, ISalesStoreState} from "@features/panels/analysis/sales/SalesPanel";
import ListToolbar from "@features/panels/shared/ListToolbar";
import {cleanFilters} from "@ui/form/filters/useCleanFilters";
import DateFieldRangeFilter from "@ui/form/filters/DateFieldRangeFilter";
import SelectFieldFilter from "@ui/form/filters/SelectFieldFilter";
import {contactsApi} from "@features/panels/contacts/contacts/api/contactsApi";

const SalesList = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<ISalesStoreFilter, ISalesStoreState>();
    const setUiState = useStore(state => state.setUIState);

    const filterStartDate = useStore(state => state.filters.filterStartDate)
    const filterEndDate = useStore(state => state.filters.filterEndDate)
    const filterClientId = useStore(state => state.filters.filterClientId)
    const setFilters = useStore(state => state.setFilters)

    const queryParams = useMemo(() => cleanFilters(
        {
            start_date: filterStartDate,
            end_date: filterEndDate,
            client_id: filterClientId,
        }
    ), [filterStartDate, filterEndDate, filterClientId])

    const {data: ddtRowsSold = [], isLoading, isFetching} = useGetDDTRowSold({queryParams});
    const {data: clients = []} = contactsApi.useGetList({queryParams: {type: "client"}});

    const columns = useMemo<MRT_ColumnDef<IDDTRowSold>[]>(() => [
        {
            accessorKey: "ddt.ddt_date",
            header: t("sales.ddt-date"),
            Cell: ({row}) => row.original.ddt?.ddt_date ? dayjs(row.original.ddt.ddt_date).format("DD/MM/YYYY") : ""
        },
        {
            accessorKey: "ddt.ddt_number",
            header: t("sales.ddt-number"),
        },
        {
            accessorKey: "ddt.client.name",
            header: t("sales.client"),
        },
        {
            accessorKey: "batch.batch_code",
            header: t("sales.batch"),
        },
        {
            accessorKey: "order_row.client_order.order_number",
            header: t("sales.order-number"),
        },
        {
            accessorKey: "order_row.client_order.order_date",
            header: t("sales.order-date"),
            Cell: ({row}) => row.original.order_row?.client_order?.order_date ? dayjs(row.original.order_row.client_order.order_date).format("DD/MM/YYYY") : ""
        },
        {
            accessorKey: "pieces",
            header: t("sales.pieces"),
        },
        {
            accessorKey: "half_piece",
            header: t("sales.half-pieces"),
        },
        {
            accessorKey: "whole_piece",
            header: t("sales.whole-pieces"),
        },
        {
            accessorKey: "kg_weight",
            header: t("sales.weight-kg"),
        },
        {
            accessorKey: "batch.article.product.name", // Non sono sicuro al 100% se sia questo il "prodotto" inteso
            header: t("sales.product"),
        },
        {
            accessorKey: "selection.name", // Potrebbe essere anche batch.selection? Non so che cazzo è di preciso in questo contesto
            header: t("sales.selection"),
        },
        {
            accessorKey: "measurement_unit.prefix",
            header: t("sales.um"),
        },
        {
            accessorKey: "quantity",
            header: t("sales.quantity"),
        },
        {
            accessorKey: "order_row.price",
            header: t("sales.order-price"),
        },
        {
            accessorKey: "price",
            header: t("sales.ddt-price"),
        },
        {
            accessorKey: "order_row.client_order.client_order_number",
            header: t("sales.client-order-number"),
        },
        {
            accessorKey: "order_row.client_order.client_order_date",
            header: t("sales.client-order-date"),
            Cell: ({row}) => row.original.order_row?.client_order?.client_order_date ? dayjs(row.original.order_row.client_order.client_order_date).format("DD/MM/YYYY") : ""
        },
        {
            accessorKey: "row_note",
            header: t("sales.note"),
        },
    ], [t]);

    return (
        <GenericList<IDDTRowSold>
            data={ddtRowsSold}
            minHeight={"780px"}
            isLoading={isLoading}
            isFetching={isFetching}
            columns={columns}
            onRowSelect={(id) => setUiState({selectedOrderRowSoldId: id as number})}
            additionalOptions={{
                enableTopToolbar: true,
                renderTopToolbar: () => (
                    <ListToolbar
                        filters={[
                            <DateFieldRangeFilter
                                key={"f-date-range"}
                                startValue={filterStartDate}
                                endValue={filterEndDate}
                                onStartFilterChange={(value) => setFilters({filterStartDate: value as string})}
                                onEndFilterChange={(value) => setFilters({filterEndDate: value as string})}
                                startLabel={t("shipping.date_start")}
                                endLabel={t("shipping.date_end")}
                            />,
                            <SelectFieldFilter
                                key={"f-client"}
                                label={t("orders.client")}
                                value={filterClientId}
                                options={clients.map(s => ({value: s.id, label: s.name}))}
                                onFilterChange={(value) => setFilters({filterClientId: value as number})}
                            />,
                        ]}
                    />
                )
            }}
        />
    )
}

export default SalesList;