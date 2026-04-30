import useGetSearchOrderRows from "@features/panels/orders/search-order-rows/api/useGetSearchOrderRows";
import GenericList from "@features/panels/shared/GenericList";
import {useTranslation} from "react-i18next";
import type {
    ISearchOrderRowsFilters,
    ISearchOrderRowsStoreState
} from "@features/panels/orders/search-order-rows/SearchOrderRowsPanel";
import {usePanel} from "@ui/panel/PanelContext";
import {useMemo} from "react";
import {cleanFilters} from "@ui/form/filters/useCleanFilters";
import type {MRT_ColumnDef} from "material-react-table";
import type {IOrderRowsSearch} from "@features/panels/orders/search-order-rows/api/IOrderRowsSearch";
import ListToolbar from "@features/panels/shared/ListToolbar";
import dayjs from "dayjs";
import DateFieldRangeFilter from "@ui/form/filters/DateFieldRangeFilter";
import RadioGroupFieldFilter from "@ui/form/filters/RadioGroupFieldFilter";
import SelectFieldFilter from "@ui/form/filters/SelectFieldFilter";
import {contactsApi} from "@features/panels/contacts/contacts/api/contactsApi";

const SearchOrderRowsList = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<ISearchOrderRowsFilters, ISearchOrderRowsStoreState>();
    const selectedOrderRowId = useStore(state => state.uiState.selectedOrderRowId);
    const setUIState = useStore(state => state.setUIState);

    const filterStartDate = useStore(state => state.filters.filterStartDate);
    const filterEndDate = useStore(state => state.filters.filterEndDate);
    const filterShippingStatus = useStore(state => state.filters.filterShippingStatus);
    const filterProductionStatus = useStore(state => state.filters.filterProductionStatus);
    const filterPrintStatus = useStore(state => state.filters.filterPrintStatus);
    const filterClientId = useStore(state => state.filters.filterClientId);
    const setFilters = useStore(state => state.setFilters);

    const queryParams = useMemo(() => cleanFilters(
        {
            start_date: filterStartDate as string,
            end_date: filterEndDate as string,
            shipping_status: filterShippingStatus as "to_ship" | "shipped",
            production_status: filterProductionStatus as "to_produce" | "produced",
            print_status: filterPrintStatus as "to_print" | "printed",
            client_id: filterClientId as number,
        }
    ), [filterStartDate, filterEndDate, filterShippingStatus, filterProductionStatus, filterPrintStatus, filterClientId])

    const {data: orderRows = [], isLoading, isFetching} = useGetSearchOrderRows({queryParams});
    const {data: clients = []} = contactsApi.useGetList({queryParams: {type: "client"}});

    const columns = useMemo<MRT_ColumnDef<IOrderRowsSearch>[]>(() => [
        {
            accessorKey: "client_order.client.name",
            header: t("order-search.client"),
        },
        {
            accessorKey: "client_order.order_number",
            header: t("order-search.order"),
        },
        // {
        //     accessorKey: "id",
        //     header: t("order-search.r"),
        //     size: 50,
        // },
        {
            accessorKey: "client_order.order_date",
            header: t("order-search.date"),
            Cell: ({row}) => row.original.client_order.order_date ? dayjs(row.original.client_order.order_date).format("DD/MM/YYYY") : ""
        },
        {
            accessorKey: "client_order.client_order_number",
            header: t("order-search.client-order"),
        },
        {
            accessorKey: "client_order.client_order_date",
            header: t("order-search.client-date"),
            Cell: ({row}) => row.original.client_order.client_order_date ? dayjs(row.original.client_order.client_order_date).format("DD/MM/YYYY") : ""
        },
        {
            accessorKey: "client_order.agent_order_number",
            header: t("order-search.agent-order"),
        },
        {
            accessorKey: "client_order.agent_order_date",
            header: t("order-search.agent-date"),
            Cell: ({row}) => row.original.client_order.agent_order_date ? dayjs(row.original.client_order.agent_order_date).format("DD/MM/YYYY") : ""
        },
        {
            accessorKey: "article.code",
            header: t("order-search.code"),
        },
        {
            accessorKey: "article.name",
            header: t("order-search.product"),
        },
        {
            accessorKey: "article.color.color",
            header: t("order-search.client-color"),
        },
        {
            accessorKey: "measurement_unit.prefix",
            header: t("order-search.um"),
            size: 30,
        },
        {
            accessorKey: "quantity",
            header: t("order-search.qta"),
        },
        {
            accessorKey: "currency.sign",
            header: t("order-search.v"),
            size: 30,
        },
        {
            accessorKey: "price",
            header: t("order-search.price"),
            Cell: ({cell}) => cell.getValue<number>()?.toFixed(4)
        },
        {
            accessorKey: "delivery_date_confirmed",
            header: t("order-search.delivery-date"),
            Cell: ({row}) => row.original.delivery_date_confirmed ? dayjs(row.original.delivery_date_confirmed).format("DD/MM/YYYY") : ""
        },
        {
            id: "qta_pro",
            header: t("order-search.qta-pro"),
            accessorFn: (row) => row.batch_orders?.batch?.quantity ?? 0,
        },
        {
            accessorKey: "production_schedule",
            header: t("order-search.scd-pro"),
        },
        {
            id: "qta_spe",
            header: t("order-search.qta-spe"),
            accessorFn: (row) => {
                const ddtRows = row.batch_orders?.batch?.ddt_rows ?? [];
                return ddtRows.reduce((acc, ddt) => acc + ddt.quantity, 0);
            },
        },
        {
            accessorKey: "shipment_schedule",
            header: t("order-search.scd-spe"),
        }
    ], [t]);

    return (
        <>
            <GenericList<IOrderRowsSearch>
                data={orderRows}
                minHeight={"780px"}
                isLoading={isLoading}
                isFetching={isFetching}
                columns={columns}
                selectedId={selectedOrderRowId}
                onRowSelect={(id) => setUIState({selectedOrderRowId: id as number})}
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
                                <RadioGroupFieldFilter
                                    key={"f-shipping-status"}
                                    value={filterShippingStatus ?? ""}
                                    onFilterChange={() => setFilters({
                                        filterShippingStatus: undefined,
                                        filterProductionStatus: undefined,
                                        filterPrintStatus: undefined,
                                    })}
                                    options={[
                                        {label: t("order-search.all"), value: ""},
                                    ]}
                                />,
                                <RadioGroupFieldFilter
                                    key={"f-shipping-status"}
                                    value={filterShippingStatus ?? ""}
                                    onFilterChange={(value) => setFilters({filterShippingStatus: (value === "" ? undefined : value) as "to_ship" | "shipped"})}
                                    options={[
                                        {label: t("order-search.to-ship"), value: "to_ship"},
                                        {label: t("order-search.shipped"), value: "shipped"},
                                    ]}
                                />,
                                <RadioGroupFieldFilter
                                    key={"f-production-status"}
                                    value={filterProductionStatus ?? ""}
                                    onFilterChange={(value) => setFilters({filterProductionStatus: (value === "" ? undefined : value) as "to_produce" | "produced"})}
                                    options={[
                                        {label: t("order-search.to-produce"), value: "to_produce"},
                                        {label: t("order-search.produced"), value: "produced"},
                                    ]}
                                />,
                                <RadioGroupFieldFilter
                                    key={"f-print-status"}
                                    value={filterPrintStatus ?? ""}
                                    onFilterChange={(value) => setFilters({filterPrintStatus: (value === "" ? undefined : value) as "to_print" | "printed"})}
                                    options={[
                                        {label: t("order-search.to-print"), value: "to_print"},
                                        {label: t("order-search.printed"), value: "printed"},
                                    ]}
                                />
                            ]}
                        />
                    )
                }}
            />
        </>
    )
};

export default SearchOrderRowsList;