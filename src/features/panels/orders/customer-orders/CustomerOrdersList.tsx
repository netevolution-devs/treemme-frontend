import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {ICustomerOrdersStoreState} from "@features/panels/orders/customer-orders/CustomerOrdersPanel.tsx";
import {customerOrderApi} from "@features/panels/orders/customer-orders/api/customerOrderApi.tsx";
import {useMemo} from "react";
import type {MRT_ColumnDef} from "material-react-table";
import GenericList from "@features/panels/shared/GenericList.tsx";
import type {ICustomerOrder} from "@features/panels/orders/customer-orders/api/ICustomerOrder.ts";

const CustomerOrdersList = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, ICustomerOrdersStoreState>();
    const selectedCustomerOrderId = useStore(state => state.uiState.selectedCustomerOrderId);
    const setUIState = useStore(state => state.setUIState);

    const {data: customerOrders = [], isLoading} = customerOrderApi.useGetList();

    const columns = useMemo<MRT_ColumnDef<ICustomerOrder>[]>(() => [
        {
            accessorKey: "order_number",
            header: t("orders.order_number"),
            size: 0
        },
        {
            accessorKey: "order_date",
            header: t("orders.order_date"),
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
            columns={columns}
            selectedId={selectedCustomerOrderId}
            onRowSelect={(id) => setUIState({selectedCustomerOrderId: id})}
        />
    )
}

export default CustomerOrdersList;