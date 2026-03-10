import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {ICustomerOrdersStoreState} from "@features/panels/orders/customer-orders/CustomerOrdersPanel.tsx";
import {customerOrderApi} from "@features/panels/orders/customer-orders/api/customerOrderApi.tsx";
import {useMemo, useRef} from "react";
import type {MRT_ColumnDef} from "material-react-table";
import type {IOrderRow} from "@features/panels/orders/customer-orders/order-rows/api/IOrderRow.ts";
import GenericList from "@features/panels/shared/GenericList.tsx";
import {Typography} from "@mui/material";
import ListToolbar from "@features/panels/shared/ListToolbar.tsx";
import {NewButton} from "@features/panels/shared/CustomButton.tsx";
import type {IDialogActions} from "@ui/dialog/IDialogActions.ts";
import OrderRowsFormDialog from "@features/panels/orders/customer-orders/order-rows/OrderRowsFormDialog.tsx";
import {openDialog} from "@ui/dialog/dialogHelper.ts";

const OrderRowsList = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, ICustomerOrdersStoreState>();
    const selectedCustomerOrderId = useStore((state) => state.uiState.selectedCustomerOrderId);
    const selectedOrderRowId = useStore((state) => state.uiState.selectedOrderRowId);
    const setUIState = useStore((state) => state.setUIState);

    const {data: customerOrder, isLoading} = customerOrderApi.useGetDetail(selectedCustomerOrderId);
    const orderRows = customerOrder?.client_order_rows || [];

    const columns = useMemo<MRT_ColumnDef<IOrderRow>[]>(() => [
        {
            accessorKey: "product.name",
            header: t("product"),
        }
    ], [t]);

    const editRowDialogRef = useRef<IDialogActions | null>(null);

    const handleOpenCreateRowDialog = () => {
        setUIState({selectedOrderRowId: null});
        openDialog(editRowDialogRef);
    }

    return (
        <>
            <OrderRowsFormDialog ref={editRowDialogRef}/>

            <Typography variant={"h5"}>{t("orders.rows")}</Typography>
            <GenericList<IOrderRow>
                data={orderRows}
                columns={columns}
                isLoading={isLoading}
                selectedId={selectedOrderRowId}
                onRowSelect={(id) => setUIState({selectedOrderRowId: id})}
                onRowDoubleClick={() => openDialog(editRowDialogRef)}
                additionalOptions={{
                    enableTopToolbar: true,
                    renderTopToolbar:
                        <ListToolbar
                            buttons={[
                                <NewButton onClick={() => handleOpenCreateRowDialog()}/>
                            ]}
                        />
                }}
            />
        </>
    )
};

export default OrderRowsList;