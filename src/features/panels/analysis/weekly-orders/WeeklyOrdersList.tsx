import {useMemo} from "react";
import {useTranslation} from "react-i18next";
import type {MRT_ColumnDef} from "material-react-table";
import GenericList from "@features/panels/shared/GenericList";
import ListToolbar from "@features/panels/shared/ListToolbar";
import {contactsApi} from "@features/panels/contacts/contacts/api/contactsApi";
import {usePanel} from "@ui/panel/PanelContext";
import DateFieldRangeFilter from "@ui/form/filters/DateFieldRangeFilter";
import SelectFieldFilter from "@ui/form/filters/SelectFieldFilter";
import {cleanFilters} from "@ui/form/filters/useCleanFilters";
import {useExportCSV} from "@features/panels/shared/hooks/createPanelApiFactory";
import type {IWeeklyOrderAverageRow} from "./api/IWeeklyOrderAverage";
import type {IWeeklyOrdersFilters, IWeeklyOrdersUIState} from "./WeeklyOrdersPanel";
import useGetWeeklyOrderAverages from "./api/useGetWeeklyOrderAverages";

const WeeklyOrdersList = () => {
    const {t, i18n} = useTranslation(["form"]);
    const {useStore} = usePanel<IWeeklyOrdersFilters, IWeeklyOrdersUIState>();
    const filterStartDate = useStore(state => state.filters.filterStartDate);
    const filterEndDate = useStore(state => state.filters.filterEndDate);
    const filterClientId = useStore(state => state.filters.filterClientId);
    // const filterDateField = useStore(state => state.filters.filterDateField ?? "order_date");
    // const filterInternal = useStore(state => state.filters.filterInternal ?? "false");
    const selectedId = useStore(state => state.uiState.selectedAverageId);
    const setFilters = useStore(state => state.setFilters);
    const setUIState = useStore(state => state.setUIState);
    const queryParams = useMemo(() => cleanFilters(
        {
            start_date: filterStartDate as string,
            end_date: filterEndDate as string,
            client_id: filterClientId as number,
            // date_field: filterDateField,
            // internal: filterInternal,
        }
    ), [filterStartDate, filterEndDate, filterClientId,
        // filterDateField, filterInternal
    ]);

    const {data, isLoading, isFetching, isError} = useGetWeeklyOrderAverages({queryParams});
    const rows = useMemo<IWeeklyOrderAverageRow[]>(() => data?.items.map(item => ({
        ...item,
        id: `${item.leather_type?.id ?? "none"}:${item.currency?.id ?? "none"}`,
    })) ?? [], [data]);
    const {data: clients = []} = contactsApi.useGetList({queryParams: {type: "client"}});
    const exportMutation = useExportCSV(
        '/client-order-row/weekly-averages', queryParams, 'weekly-orders-export.csv', 'ORDER-ROW-WEEKLY-AVERAGES'
    );

    const changeFilters = (partial: Partial<IWeeklyOrdersFilters>) => {
        setUIState({selectedAverageId: null});
        setFilters(partial);
    };

    const decimals = useMemo(() => new Intl.NumberFormat(i18n.language, {maximumFractionDigits: 2}), [i18n.language]);

    const columns = useMemo<MRT_ColumnDef<IWeeklyOrderAverageRow>[]>(() => [
        {
            accessorKey: "leather_type.name",
            header: t("weekly-orders.class"),
            size: 160,
            Cell: ({cell}) => cell.getValue<string>() || "-",
        },
        {
            accessorKey: "currency.name",
            header: t("weekly-orders.currency"),
            size: 180,
            Cell: ({cell}) => cell.getValue<string>() || "-",
        },
        {
            accessorKey: "rows_count",
            header: t("weekly-orders.rows-count"),
            size: 170,
            Cell: ({cell}) => cell.getValue<number | null>() ?? "-",
        },
        {
            accessorKey: "total_amount",
            header: t("weekly-orders.total-amount"),
            size: 170,
            Cell: ({cell}) => {
                const value = cell.getValue<number | null>();
                return value == null ? "-" : decimals.format(value);
            },
        },
        {
            accessorKey: "total_currency_amount",
            header: t("weekly-orders.total-currency-amount"),
            size: 190,
            Cell: ({cell}) => {
                const value = cell.getValue<number | null>();
                return value == null ? "-" : decimals.format(value);
            },
        },
        {
            accessorKey: "total_quantity_pq",
            header: t("weekly-orders.quantity-pq"),
            size: 170,
            Cell: ({cell}) => {
                const value = cell.getValue<number | null>();
                return value == null ? "-" : decimals.format(value);
            },
        },
        {
            accessorKey: "avg_price_pq",
            header: t("weekly-orders.average-price-pq"),
            size: 170,
            Cell: ({cell}) => {
                const value = cell.getValue<number | null>();
                return value == null ? "-" : decimals.format(value);
            },
        },
        {
            accessorKey: "total_quantity_mq",
            header: t("weekly-orders.quantity-mq"),
            size: 170,
            Cell: ({cell}) => {
                const value = cell.getValue<number | null>();
                return value == null ? "-" : decimals.format(value);
            },
        },
        {
            accessorKey: "avg_price_mq",
            header: t("weekly-orders.average-price-mq"),
            size: 170,
            Cell: ({cell}) => {
                const value = cell.getValue<number | null>();
                return value == null ? "-" : decimals.format(value);
            },
        },
    ], [t, decimals]);

    return (
        <GenericList<IWeeklyOrderAverageRow>
            fullHeight
            data={rows}
            isLoading={isLoading}
            isFetching={isFetching}
            columns={columns}
            minHeight={"300px"}
            maxHeight={"450px"}
            selectedId={selectedId}
            onRowSelect={id => setUIState({selectedAverageId: id})}
            additionalOptions={{
                enableTopToolbar: true,
                state: {showAlertBanner: isError},
                muiToolbarAlertBannerProps: {color: "error", children: t("weekly-orders.load-error")},
                renderTopToolbar: () => (
                    <ListToolbar
                        filters={[
                            <DateFieldRangeFilter
                                key={"f-date-range"}
                                startValue={filterStartDate}
                                endValue={filterEndDate}
                                onStartFilterChange={value => changeFilters({filterStartDate: value})}
                                onEndFilterChange={value => changeFilters({filterEndDate: value})}
                                startLabel={t("shipping.date_start")}
                                endLabel={t("shipping.date_end")}
                            />,
                            <SelectFieldFilter
                                key={"f-client"}
                                label={t("orders.client")}
                                value={filterClientId}
                                autoSelectFirstOption={false}
                                options={clients.map(client => ({value: client.id, label: client.name}))}
                                onFilterChange={value => changeFilters({filterClientId: value as number | undefined})}
                            />,
                            // <SelectFieldFilter
                            //     key={"f-date-field"}
                            //     label={t("weekly-orders.date-field")}
                            //     value={filterDateField}
                            //     options={[
                            //         {value: "order_date", label: t("weekly-orders.order-date")},
                            //         {value: "delivery_date_confirmed", label: t("weekly-orders.delivery-date")},
                            //     ]}
                            //     onFilterChange={value => changeFilters({
                            //         filterDateField: value === "delivery_date_confirmed" ? value : "order_date",
                            //     })}
                            // />,
                            // <SelectFieldFilter
                            //     key={"f-internal"}
                            //     label={t("order-search.request-type")}
                            //     value={filterInternal}
                            //     options={[
                            //         {label: t("order-search.normal-requests"), value: "false"},
                            //         {label: t("order-search.internal-requests"), value: "true"},
                            //         {label: t("order-search.all-requests"), value: "all"},
                            //     ]}
                            //     onFilterChange={value => changeFilters({
                            //         filterInternal: value === "true" || value === "all" ? value : "false",
                            //     })}
                            // />,
                        ]}
                        onExport={() => exportMutation.mutate()}
                        exportLoading={exportMutation.isPending}
                        alignButtons={"flex-end"}
                        sx={{mr: 1}}
                    />
                ),
            }}
        />
    );
};

export default WeeklyOrdersList;
