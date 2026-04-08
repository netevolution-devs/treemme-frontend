import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext";
import type {
    ICustomerOrdersFilters,
    ICustomerOrdersStoreState
} from "@features/panels/orders/customer-orders/CustomerOrdersPanel";
import {customerOrderApi} from "@features/panels/orders/customer-orders/api/customerOrderApi";
import {useMemo} from "react";
import type {MRT_ColumnDef} from "material-react-table";
import GenericList from "@features/panels/shared/GenericList";
import type {ICustomerOrder} from "@features/panels/orders/customer-orders/api/ICustomerOrder";
import dayjs from "dayjs";
import ListToolbar from "@features/panels/shared/ListToolbar";
import {cleanFilters} from "@ui/form/filters/useCleanFilters";
import SelectFieldFilter from "@ui/form/filters/SelectFieldFilter";
import {contactsApi} from "@features/panels/contacts/contacts/api/contactsApi";
import TextFieldFilter from "@ui/form/filters/TextFieldFilter";

const CustomerOrdersList = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<ICustomerOrdersFilters, ICustomerOrdersStoreState>();
    const selectedCustomerOrderId = useStore(state => state.uiState.selectedCustomerOrderId);
    const setUIState = useStore(state => state.setUIState);

    const filterOrderCode = useStore(state => state.filters.filterOrderCode);
    const filterOrderClientId = useStore(state => state.filters.filterOrderClientId);
    const setFilters = useStore(state => state.setFilters);

    const queryParams = useMemo(() => cleanFilters(
        {
            client: filterOrderClientId,
            order_number: filterOrderCode,
        }
    ), [filterOrderCode, filterOrderClientId]);

    const {data: customerOrders = [], isLoading, isFetching} = customerOrderApi.useGetList({queryParams});
    const {data: clients = []} = contactsApi.useGetList({queryParams: {type: "client"}});


    const columns = useMemo<MRT_ColumnDef<ICustomerOrder>[]>(() => [
        {
            accessorKey: "order_number",
            header: t("orders.order_number"),
            size: 0
        },
        {
            accessorKey: "order_date",
            header: t("orders.order_date"),
            Cell: ({row}) => <>{dayjs(row.original.order_date).format("DD/MM/YYYY")}</>
        },
        {
            accessorKey: "client.name",
            header: t("orders.client"),
        }
    ], [t]);

    return (
        <GenericList<ICustomerOrder>
            data={customerOrders}
            isLoading={isLoading}
            isFetching={isFetching}
            columns={columns}
            selectedId={selectedCustomerOrderId}
            onRowSelect={(id) => setUIState({selectedCustomerOrderId: id})}
            additionalOptions={{
                enableTopToolbar: true,
                renderTopToolbar: () => (
                    <ListToolbar
                        filters={[
                            <TextFieldFilter
                                key={"f-order_code"}
                                label={t("orders.order_code")}
                                value={filterOrderCode}
                                onFilterChange={(val) => setFilters({filterOrderCode: val as string})}
                            />,
                            <SelectFieldFilter
                                key={"f-client"}
                                label={t("orders.client")}
                                value={filterOrderClientId}
                                options={clients.map(s => ({value: s.id, label: s.name}))}
                                onFilterChange={(value) => setFilters({filterOrderClientId: value as number})}
                            />,
                        ]}
                    />
                )
            }}
        />
    )
}

export default CustomerOrdersList;