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
import ColorLensIcon from '@mui/icons-material/ColorLens';
import SettingsInputHdmiIcon from '@mui/icons-material/SettingsInputHdmi';
import useCallablePanel from "@ui/panel/useCallablePanel.ts";
import {openDialog} from "@ui/dialog/dialogHelper.ts";
import type {IDialogActions} from "@ui/dialog/IDialogActions.ts";
import DyeFormDialog from "@features/panels/orders/customer-orders/order-rows/dye/DyeFormDialog.tsx";
import RefinementFormDialog
    from "@features/panels/orders/customer-orders/order-rows/refinement/RefinementFormDialog.tsx";

const OrderRowsList = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, ICustomerOrdersStoreState>();
    const selectedCustomerOrderId = useStore((state) => state.uiState.selectedCustomerOrderId);
    const selectedOrderRowId = useStore((state) => state.uiState.selectedOrderRowId);
    const setUIState = useStore((state) => state.setUIState);

    const {add: addSelectPanel} = useCallablePanel();

    const {data: customerOrder, isLoading, isFetching} = customerOrderApi.useGetDetail(selectedCustomerOrderId);
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

    const handleOpenCreateRowDialog = () => {
        setUIState({selectedOrderRowId: null});
        addSelectPanel({
            initialValue: '',
            extra: {
                client_order_id: selectedCustomerOrderId,
                panelId: "createOrderRows"
            },
            menu: {
                component: "orderRows",
                i18nKey: "menu.orders.rows"
            },
            customId: "createOrderRows"
        });
    }

    const dyeDialogRef = useRef<IDialogActions | null>(null);
    const refinementDialogRef = useRef<IDialogActions | null>(null);

    return (
        <>
            <DyeFormDialog ref={dyeDialogRef}/>
            <RefinementFormDialog ref={refinementDialogRef}/>

            <GenericList<IOrderRow>
                disableBorder
                data={orderRows}
                columns={columns}
                isLoading={isLoading}
                isFetching={isFetching}
                selectedId={selectedOrderRowId}
                onRowSelect={(id) => setUIState({selectedOrderRowId: id as number})}
                onRowDoubleClick={() => {
                    addSelectPanel({
                        initialValue: '',
                        extra: {
                            client_order_id: selectedCustomerOrderId,
                            order_row_id: selectedOrderRowId,
                            panelId: "updateOrderRows:" + selectedOrderRowId
                        },
                        menu: {
                            component: "orderRows",
                            i18nKey: "menu.orders.rows"
                        },
                        customId: "updateOrderRows:" + selectedOrderRowId
                    });
                }}
                additionalOptions={{
                    enableRowActions: true,
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
                    enableTopToolbar: true,
                    renderTopToolbar: () => (
                        <ListToolbar
                            buttons={[
                                <NewButton
                                    isEnable={!!selectedCustomerOrderId}
                                    onClick={() => handleOpenCreateRowDialog()}
                                />
                            ]}
                            label={<Typography variant={"h5"}>{t("orders.rows")}</Typography>}
                            sx={{mt: 0}}
                        />
                    )
                }}
            />
        </>
    )
};

export default OrderRowsList;