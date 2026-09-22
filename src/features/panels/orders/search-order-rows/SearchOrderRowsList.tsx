import useGetSearchOrderRows from "@features/panels/orders/search-order-rows/api/useGetSearchOrderRows";
import GenericList from "@features/panels/shared/GenericList";
import {useTranslation} from "react-i18next";
import type {
    ISearchOrderRowsFilters,
    ISearchOrderRowsStoreState
} from "@features/panels/orders/search-order-rows/SearchOrderRowsPanel";
import {usePanel} from "@ui/panel/PanelContext";
import {useMemo, useRef} from "react";
import {cleanFilters} from "@ui/form/filters/useCleanFilters";
import type {MRT_ColumnDef} from "material-react-table";
import type {IOrderRowsSearch} from "@features/panels/orders/search-order-rows/api/IOrderRowsSearch";
import ListToolbar from "@features/panels/shared/ListToolbar";
import dayjs from "dayjs";
import DateFieldRangeFilter from "@ui/form/filters/DateFieldRangeFilter";
import RadioGroupFieldFilter from "@ui/form/filters/RadioGroupFieldFilter";
import SelectFieldFilter from "@ui/form/filters/SelectFieldFilter";
import {contactsApi} from "@features/panels/contacts/contacts/api/contactsApi";
import {PrintButton} from "@features/panels/shared/CustomButton";
import useGetClientOrderRowSummaryPrint from "@features/panels/orders/search-order-rows/api/useGetOrderSearchClientPdf";
import useGetProductionReportPdf from "@features/panels/orders/customer-orders/api/useGetProductionReportPdf";
import {Box, MenuItem, useTheme} from "@mui/material";
import {useExportCSV} from "@features/panels/shared/hooks/createPanelApiFactory";
import ColorLensIcon from '@mui/icons-material/ColorLens';
import SettingsInputHdmiIcon from '@mui/icons-material/SettingsInputHdmi';
import {openDialog} from "@ui/dialog/dialogHelper";
import type {IDialogActions} from "@ui/dialog/IDialogActions";
import DyeFormDialog from "@features/panels/orders/customer-orders/order-rows/dye/DyeFormDialog";
import RefinementFormDialog from "@features/panels/orders/customer-orders/order-rows/refinement/RefinementFormDialog";
import {useAuth} from "@features/auth/model/AuthContext";
import {permissionEngine} from "@features/authz/permission.utils";
import type {IAccessControl} from "@features/user/model/RoleInterfaces";

const SearchOrderRowsList = () => {
    const {t} = useTranslation(["form"]);
    const theme = useTheme();

    const {useStore} = usePanel<ISearchOrderRowsFilters, ISearchOrderRowsStoreState>();
    const selectedOrderRowId = useStore(state => state.uiState.selectedOrderRowId);
    const setUIState = useStore(state => state.setUIState);

    const dyeDialogRef = useRef<IDialogActions | null>(null);
    const refinementDialogRef = useRef<IDialogActions | null>(null);

    const {user} = useAuth();
    const engine = permissionEngine((user?.accessControl ?? []) as IAccessControl[]);
    const canPost = engine.can("ordini - ordini clienti", 'post');

    const filterStartDate = useStore(state => state.filters.filterStartDate);
    const filterEndDate = useStore(state => state.filters.filterEndDate);
    const filterShippingStatus = useStore(state => state.filters.filterShippingStatus);
    const filterProductionStatus = useStore(state => state.filters.filterProductionStatus);
    const filterPrintStatus = useStore(state => state.filters.filterPrintStatus);
    const filterClientId = useStore(state => state.filters.filterClientId);
    const filterAll = useStore(state => state.filters.filterAll);
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

    const {mutateAsync: getOrderRowPrint, isPending: isOrderRowPrintPending} = useGetClientOrderRowSummaryPrint();
    const {mutateAsync: getProductionReport, isPending: isProductionReportPending} = useGetProductionReportPdf();
    const exportMutation = useExportCSV('/client-order-row-report', queryParams, 'order-rows-export.csv', 'ORDER-ROWS-SEARCH');

    const canPrint = orderRows.length > 0;

    const contentColumnWidths = useMemo(() => {
        const context = document.createElement('canvas').getContext('2d');
        if (!context) return {client: 300, articleCode: 300, product: 300};

        context.font = `${theme.typography.body2.fontWeight} ${theme.typography.body2.fontSize} ${theme.typography.fontFamily}`;
        const measure = (value: string | null | undefined) =>
            Math.ceil(context.measureText((value ?? '').toUpperCase()).width) + 32;

        return orderRows.reduce((widths, row) => ({
            client: Math.max(widths.client, measure(row.client_order.client.name)),
            articleCode: Math.max(widths.articleCode, measure(row.article?.code)),
            product: Math.max(widths.product, measure(row.article?.name)),
        }), {client: 160, articleCode: 110, product: 180});
    }, [orderRows, theme.typography]);

    const columns = useMemo<MRT_ColumnDef<IOrderRowsSearch>[]>(() => [
        {
            accessorKey: "client_order.client.name",
            header: t("order-search.client"),
            size: contentColumnWidths.client,
        },
        {
            accessorKey: "client_order.order_number",
            header: t("order-search.order"),
            size: 90,
        },
        // {
        //     accessorKey: "id",
        //     header: t("order-search.r"),
        //     size: 50,
        // },
        {
            accessorKey: "client_order.order_date",
            header: t("order-search.date"),
            size: 85,
            Cell: ({row}) => row.original.client_order.order_date ? dayjs(row.original.client_order.order_date).format("DD/MM/YYYY") : ""
        },
        {
            accessorKey: "client_order.client_order_number",
            header: t("order-search.client-order"),
            size: 85,
        },
        {
            accessorKey: "client_order.client_order_date",
            header: t("order-search.client-date"),
            size: 85,
            Cell: ({row}) => row.original.client_order.client_order_date ? dayjs(row.original.client_order.client_order_date).format("DD/MM/YYYY") : ""
        },
        {
            accessorKey: "client_order.agent_order_number",
            header: t("order-search.agent-order"),
            size: 115,
        },
        {
            accessorKey: "client_order.agent_order_date",
            header: t("order-search.agent-date"),
            size: 85,
            Cell: ({row}) => row.original.client_order.agent_order_date ? dayjs(row.original.client_order.agent_order_date).format("DD/MM/YYYY") : ""
        },
        {
            accessorKey: "article.code",
            header: t("order-search.code"),
            size: contentColumnWidths.articleCode,
        },
        {
            accessorKey: "article.name",
            header: t("order-search.product"),
            size: contentColumnWidths.product,
        },
        {
            accessorKey: "article.color.color",
            header: t("order-search.client-color"),
            size: 120,
        },
        {
            accessorKey: "measurement_unit.prefix",
            header: t("order-search.um"),
            enableSorting: false,
            size: 65,
        },
        {
            accessorKey: "quantity",
            header: t("order-search.qta"),
            size: 100,
        },
        {
            accessorKey: "currency.sign",
            header: t("order-search.v"),
            enableSorting: false,
            size: 65,
        },
        {
            accessorKey: "price",
            header: t("order-search.price"),
            size: 100,
            Cell: ({cell}) => cell.getValue<number>()?.toFixed(4)
        },
        {
            accessorKey: "delivery_date_confirmed",
            header: t("order-search.delivery-date"),
            size: 120,
            Cell: ({row}) => row.original.delivery_date_confirmed ? dayjs(row.original.delivery_date_confirmed).format("DD/MM/YYYY") : ""
        },
        {
            id: "qta_pro",
            header: t("order-search.qta-pro"),
            size: 120,
            accessorFn: (row) => row.batch_orders?.batch?.quantity ?? 0,
        },
        {
            accessorKey: "production_schedule",
            header: t("order-search.scd-pro"),
            size: 120,
        },
        {
            id: "qta_spe",
            header: t("order-search.qta-spe"),
            size: 100,
            accessorFn: (row) => {
                const ddtRows = row.batch_orders?.batch?.ddt_rows ?? [];
                return ddtRows.reduce((acc, ddt) => acc + ddt.quantity, 0);
            },
        },
        {
            accessorKey: "shipment_schedule",
            header: t("order-search.scd-spe"),
            size: 120,
        }
    ], [t, contentColumnWidths]);

    return (
        <>
            <DyeFormDialog ref={dyeDialogRef}/>
            <RefinementFormDialog ref={refinementDialogRef}/>

            <GenericList<IOrderRowsSearch>
                data={orderRows}
                fillHeight
                isLoading={isLoading}
                isFetching={isFetching}
                columns={columns}
                selectedId={selectedOrderRowId}
                onRowSelect={(id) => setUIState({selectedOrderRowId: id as number})}
                additionalOptions={{
                    enableRowActions: canPost,
                    renderRowActionMenuItems: ({row, closeMenu}) => [
                        <MenuItem key="dye" onClick={() => {
                            openDialog(dyeDialogRef)
                            setUIState({selectedOrderRowId: row.original.id})
                            closeMenu()
                        }}>
                            <ColorLensIcon color={"primary"} sx={{mr: 1}}/>
                            {t("orders.row.dye")}
                        </MenuItem>,
                        <MenuItem key="refinishing" onClick={() => {
                            openDialog(refinementDialogRef)
                            setUIState({selectedOrderRowId: row.original.id})
                            closeMenu()
                        }}>
                            <SettingsInputHdmiIcon color={"success"} sx={{mr: 1}}/>
                            {t("orders.row.refinement")}
                        </MenuItem>
                    ],
                    layoutMode: 'grid-no-grow',
                    muiTableProps: {
                        sx: {
                            '& .MuiTableCell-root': {px: 0.75},
                            '& .MuiTableHead-root .Mui-TableHeadCell-Content-Wrapper': {
                                whiteSpace: 'normal',
                            },
                        },
                    },
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
                                />
                            ]}
                            buttons={[
                                <Box sx={{display: 'flex'}}>
                                    <RadioGroupFieldFilter
                                        key={"f-shipping-status-all"}
                                        value={filterAll ?? ""}
                                        onFilterChange={() => setFilters({
                                            filterShippingStatus: undefined,
                                            filterProductionStatus: undefined,
                                            filterPrintStatus: undefined,
                                            filterAll: "all"
                                        })}
                                        options={[
                                            {label: t("order-search.all"), value: "all"},
                                        ]}
                                    />
                                    <RadioGroupFieldFilter
                                        key={"f-shipping-status"}
                                        value={filterShippingStatus ?? ""}
                                        onFilterChange={(value) => setFilters({
                                            filterShippingStatus: (value === "" ? undefined : value) as "to_ship" | "shipped",
                                            filterAll: undefined
                                        })}
                                        options={[
                                            {label: t("order-search.to-ship"), value: "to_ship"},
                                            {label: t("order-search.shipped"), value: "shipped"},
                                        ]}
                                    />
                                    <RadioGroupFieldFilter
                                        key={"f-production-status"}
                                        value={filterProductionStatus ?? ""}
                                        onFilterChange={(value) => setFilters({
                                            filterProductionStatus: (value === "" ? undefined : value) as "to_produce" | "produced",
                                            filterAll: undefined
                                        })}
                                        options={[
                                            {label: t("order-search.to-produce"), value: "to_produce"},
                                            {label: t("order-search.produced"), value: "produced"},
                                        ]}
                                    />
                                    <RadioGroupFieldFilter
                                        key={"f-print-status"}
                                        value={filterPrintStatus ?? ""}
                                        onFilterChange={(value) => setFilters({
                                            filterPrintStatus: (value === "" ? undefined : value) as "to_print" | "printed",
                                            filterAll: undefined
                                        })}
                                        options={[
                                            {label: t("order-search.to-print"), value: "to_print"},
                                            {label: t("order-search.printed"), value: "printed"},
                                        ]}
                                    />
                                </Box>,
                                <PrintButton
                                    label={t("order-search.production-report")}
                                    canPrint={canPrint}
                                    isPending={isProductionReportPending}
                                    onClick={() => getProductionReport({
                                        params: {
                                            start_date: filterStartDate,
                                            end_date: filterEndDate,
                                            print_status: filterPrintStatus,
                                        }
                                    })}
                                />,
                                <PrintButton
                                    label={t("order-search.order-row-report")}
                                    canPrint={canPrint}
                                    isPending={isOrderRowPrintPending}
                                    onClick={() => getOrderRowPrint({
                                        params: queryParams
                                    })}
                                />
                            ]}
                            onExport={() => exportMutation.mutate()}
                            exportLoading={exportMutation.isPending}
                            alignButtons={"flex-end"}
                            sx={{mr: 1}}
                        />
                    )
                }}
            />
        </>
    )
};

export default SearchOrderRowsList;
