import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext";
import type {ICustomerOrdersStoreState} from "@features/panels/orders/customer-orders/CustomerOrdersPanel";
import {customerOrderApi} from "@features/panels/orders/customer-orders/api/customerOrderApi";
import {useMemo, useRef} from "react";
import type {MRT_ColumnDef} from "material-react-table";
import type {IOrderRow} from "@features/panels/orders/customer-orders/order-rows/api/IOrderRow";
import GenericList from "@features/panels/shared/GenericList";
import {MenuItem, Typography} from "@mui/material";
import ListToolbar from "@features/panels/shared/ListToolbar";
import {NewButton} from "@features/panels/shared/CustomButton";
import ColorLensIcon from '@mui/icons-material/ColorLens';
import SettingsInputHdmiIcon from '@mui/icons-material/SettingsInputHdmi';
import useCallablePanel from "@ui/panel/useCallablePanel";
import {openDialog} from "@ui/dialog/dialogHelper";
import type {IDialogActions} from "@ui/dialog/IDialogActions";
import DyeFormDialog from "@features/panels/orders/customer-orders/order-rows/dye/DyeFormDialog";
import RefinementFormDialog
    from "@features/panels/orders/customer-orders/order-rows/refinement/RefinementFormDialog";
import {useAuth} from "@features/auth/model/AuthContext";
import {permissionEngine} from "@features/authz/permission.utils";
import type {IAccessControl} from "@features/user/model/RoleInterfaces";
import dayjs from "dayjs";

const OrderRowsList = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, ICustomerOrdersStoreState>();
    const selectedCustomerOrderId = useStore((state) => state.uiState.selectedCustomerOrderId);
    const selectedOrderRowId = useStore((state) => state.uiState.selectedOrderRowId);
    const selectedClientId = useStore((state) => state.uiState.selectedClientId);
    const setUIState = useStore((state) => state.setUIState);

    const {add: addSelectPanel} = useCallablePanel();

    const {data: customerOrder, isLoading, isFetching} = customerOrderApi.useGetDetail(selectedCustomerOrderId);
    const orderRows = customerOrder?.client_order_rows || [];

    const columns = useMemo<MRT_ColumnDef<IOrderRow>[]>(() => [
        {
            accessorKey: "measurement_unit.name",
            header: t("orders.row.measurement_unit"),
        },

        {
            accessorKey: "quantity",
            header: t("orders.row.quantity"),
        },
        {
            accessorKey: "delivery_date_confirmed",
            header: t("orders.row.delivery_date_confirmed"),
            Cell: ({row}) => row.original.delivery_date_confirmed ? dayjs(row.original.delivery_date_confirmed).format("DD/MM/YYYY") : "-",
        },
        {
            accessorKey: "article.name",
            header: t("orders.row.article"),
        },
        {
            accessorKey: "currency.sign",
            header: t("orders.row.currency"),
        },
        {
            accessorKey: "currency_price",
            header: t("orders.row.currency_price"),
        },
        {
            accessorKey: "production_row_note",
            header: t("orders.row.production_row_note"),
        },
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

    const {user} = useAuth();
    const engine = permissionEngine((user?.accessControl ?? []) as IAccessControl[]);
    const canPost = engine.can("ordini - ordini clienti", 'post');

    return (
        <>
            <DyeFormDialog ref={dyeDialogRef}/>
            <RefinementFormDialog ref={refinementDialogRef}/>

            <GenericList<IOrderRow>
                disableBorder
                minHeight={"455px"}
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
                            clientId: selectedClientId,
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
                    enableTopToolbar: true,
                    renderTopToolbar: () => (
                        <ListToolbar
                            buttons={[
                                <NewButton
                                    isEnable={!!selectedCustomerOrderId && canPost}
                                    onClick={() => handleOpenCreateRowDialog()}
                                />
                            ]}
                            label={<Typography variant={"h6"}>{t("orders.rows")}</Typography>}
                            sx={{mt: 0}}
                        />
                    )
                }}
            />
        </>
    )
};

export default OrderRowsList;