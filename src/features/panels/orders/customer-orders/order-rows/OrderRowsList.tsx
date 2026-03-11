import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {ICustomerOrdersStoreState} from "@features/panels/orders/customer-orders/CustomerOrdersPanel.tsx";
import {customerOrderApi} from "@features/panels/orders/customer-orders/api/customerOrderApi.tsx";
import {useMemo, useRef} from "react";
import type {MRT_ColumnDef} from "material-react-table";
import type {IOrderRow} from "@features/panels/orders/customer-orders/order-rows/api/IOrderRow.ts";
import GenericList from "@features/panels/shared/GenericList.tsx";
import {MenuItem, Typography} from "@mui/material";
import ListToolbar from "@features/panels/shared/ListToolbar.tsx";
import {NewButton} from "@features/panels/shared/CustomButton.tsx";
import type {IDialogActions} from "@ui/dialog/IDialogActions.ts";
import OrderRowsFormDialog from "@features/panels/orders/customer-orders/order-rows/OrderRowsFormDialog.tsx";
import {openDialog} from "@ui/dialog/dialogHelper.ts";
import ColorLensIcon from '@mui/icons-material/ColorLens';
import SettingsInputHdmiIcon from '@mui/icons-material/SettingsInputHdmi';
import DyeFormDialog from "@features/panels/orders/customer-orders/order-rows/dyeing/DyeFormDialog.tsx";
import RefineFormDialog from "@features/panels/orders/customer-orders/order-rows/refinishing/RefineFormDialog.tsx";

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
            accessorKey: "article.name",
            header: t("orders.row.article"),
        },
        {
            accessorKey: "quantity",
            header: t("orders.row.quantity"),
        },
        {
            accessorKey: "measurement_unit.name",
            header: t("orders.row.measurement_unit"),
        }
    ], [t]);

    const editRowDialogRef = useRef<IDialogActions | null>(null);
    const dyeDialogRef = useRef<IDialogActions | null>(null);
    const refineDialogRef = useRef<IDialogActions | null>(null);

    const handleOpenCreateRowDialog = () => {
        setUIState({selectedOrderRowId: null});
        openDialog(editRowDialogRef);
    }

    return (
        <>
            <OrderRowsFormDialog ref={editRowDialogRef}/>
            <DyeFormDialog ref={dyeDialogRef}/>
            <RefineFormDialog ref={refineDialogRef}/>

            <Typography variant={"h5"}>{t("orders.rows")}</Typography>
            <GenericList<IOrderRow>
                data={orderRows}
                columns={columns}
                isLoading={isLoading}
                selectedId={selectedOrderRowId}
                onRowSelect={(id) => setUIState({selectedOrderRowId: id})}
                onRowDoubleClick={() => openDialog(editRowDialogRef)}
                additionalOptions={{
                    enableRowActions: true,
                    renderRowActionMenuItems: () => [
                        <MenuItem key="dye" onClick={() => {openDialog(dyeDialogRef)}}>
                            <ColorLensIcon color={"primary"} sx={{mr: 1}} />
                            {t("orders.row.dye")}
                        </MenuItem>,
                        <MenuItem key="refinishing" onClick={() => {openDialog(refineDialogRef)}}>
                            <SettingsInputHdmiIcon color={"success"} sx={{mr: 1}} />
                            {t("orders.row.refinishing")}
                        </MenuItem>
                    ],
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