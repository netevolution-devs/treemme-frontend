import {usePanel} from "@ui/panel/PanelContext.tsx";
import {useTranslation} from "react-i18next";
import GenericForm from "@features/panels/shared/GenericForm.tsx";
import SelectFieldControlled from "@ui/form/controlled/SelectFieldController.tsx";
import DateFieldControlled from "@ui/form/controlled/DateFieldControlled.tsx";
import FlagCheckBoxFieldControlled from "@ui/form/controlled/FlagCheckBoxFieldControlled.tsx";
import NumberFieldControlled from "@ui/form/controlled/NumberFieldControlled.tsx";
import {Box, Stack} from "@mui/material";
import {forwardRef} from "react";
import type {IDialogActions} from "@ui/dialog/IDialogActions.ts";
import BaseDialog from "@ui/dialog/BaseDialog.tsx";
import type {IOrderRow} from "@features/panels/orders/customer-orders/order-rows/api/IOrderRow.ts";
import type {ICustomerOrdersStoreState} from "@features/panels/orders/customer-orders/CustomerOrdersPanel.tsx";
import {measurementUnitApi} from "@features/panels/shared/api/measurement-unit/measurementUnitApi.ts";
import {orderRowApi} from "@features/panels/orders/customer-orders/order-rows/api/orderRowApi.ts";
import {articleApi} from "@features/panels/products/articles/api/articleApi.ts";
import {customerOrderApi} from "@features/panels/orders/customer-orders/api/customerOrderApi.tsx";

type Props = unknown;

export type IOrderRowForm = Omit<IOrderRow,
    'id' |
    'article' |
    'measurement_unit' |
    'client_order'
> & {
    id?: number;
    // product_id: number;
    article_id: number;
    measurement_unit_id: number;
    client_order_id: number;
};

const OrderRowsFormDialog = forwardRef<IDialogActions, Props>((_props, ref) => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, ICustomerOrdersStoreState>();
    const selectedCustomerOrderId = useStore(state => state.uiState.selectedCustomerOrderId);
    const selectedOrderRowId = useStore(state => state.uiState.selectedOrderRowId);
    const setUIState = useStore(state => state.setUIState);

    const {useGetDetail, usePost, usePut, useDelete} = orderRowApi;
    const {data: orderRow} = useGetDetail(selectedOrderRowId);

    const {data: order} = customerOrderApi.useGetDetail(selectedCustomerOrderId);

    const {mutateAsync: createRow, isPending: isPosting} = usePost({
        invalidateQueries: ['CLIENT-ORDER', String(selectedCustomerOrderId)]
    });
    const {mutateAsync: updateRow, isPending: isPutting} = usePut({
        invalidateQueries: ['CLIENT-ORDER', String(selectedCustomerOrderId)]
    });
    const {mutateAsync: deleteRow, isPending: isDeleting} = useDelete({
        invalidateQueries: ['CLIENT-ORDER', String(selectedCustomerOrderId)]
    });

    const {data: articles = []} = articleApi.useGetList({queryParams: {client: order?.client.id as number}});
    const {data: measurementUnits = []} = measurementUnitApi.useGetList();

    return (
        <BaseDialog ref={ref} sx={{p: 2}}>
            <GenericForm<IOrderRowForm, IOrderRow>
                dialogMode
                dialogRef={ref}
                selectedId={selectedOrderRowId}
                entity={orderRow}
                emptyValues={{
                    // product_id: 0,
                    measurement_unit_id: 0,
                    processed: false,
                    cancelled: false,
                    weight: null,
                    quantity: 0,
                    price: null,
                    total_price: null,
                    currency_price: null,
                    currency_exchange: 1,
                    total_currency_price: null,
                    agent_percentage_row: null,
                    tolerance_quantity_percentage: null,
                    shipment_schedule: null,
                    production_schedule: null,
                    delivery_date_request: null,
                    delivery_date_confirmed: null,
                    article_id: 0,
                    client_order_id: selectedCustomerOrderId ?? 0
                }}
                mapEntityToForm={(x) => ({
                    // product_id: x.product.id,
                    measurement_unit_id: x.measurement_unit.id,
                    processed: x.processed,
                    cancelled: x.cancelled,
                    weight: x.weight,
                    quantity: x.quantity,
                    price: x.price,
                    total_price: x.total_price,
                    currency_price: x.currency_price,
                    currency_exchange: x.currency_exchange,
                    total_currency_price: x.total_currency_price,
                    agent_percentage_row: x.agent_percentage_row,
                    tolerance_quantity_percentage: x.tolerance_quantity_percentage,
                    shipment_schedule: x.shipment_schedule,
                    production_schedule: x.production_schedule,
                    delivery_date_request: x.delivery_date_request,
                    delivery_date_confirmed: x.delivery_date_confirmed,
                    article_id: x.article.id,
                    client_order_id: selectedCustomerOrderId ?? 0
                })}
                create={(payload) => createRow({
                    ...payload,
                    client_order_id: selectedCustomerOrderId as number
                })}
                update={(id, payload) => updateRow({
                    id,
                    payload: {
                        ...payload,
                        client_order_id: selectedCustomerOrderId as number
                    }
                })}
                remove={(id) => deleteRow(id)}
                isSaving={isPosting || isPutting}
                isDeleting={isDeleting}
                onClearSelection={() => setUIState({selectedOrderRowId: null})}
                renderFields={() => (
                    <Stack gap={2}>
                        <Box sx={{display: 'flex', gap: 1, alignItems: 'center'}}>
                            <SelectFieldControlled<IOrderRowForm>
                                name="article_id"
                                label={t("orders.row.article")}
                                options={articles?.map(p => ({value: p.id, label: p.name})) || []}
                                required
                            />
                            <FlagCheckBoxFieldControlled<IOrderRowForm>
                                name="processed"
                                label={t("orders.row.processed")}
                            />
                            <FlagCheckBoxFieldControlled<IOrderRowForm>
                                name="cancelled"
                                label={t("orders.row.cancelled")}
                            />
                        </Box>

                        <Box sx={{display: 'flex', gap: 1}}>
                            <SelectFieldControlled<IOrderRowForm>
                                name="measurement_unit_id"
                                label={t("orders.row.measurement_unit")}
                                options={measurementUnits?.map(mu => ({value: mu.id, label: mu.name})) || []}
                                required
                            />
                            <NumberFieldControlled<IOrderRowForm>
                                name="quantity"
                                label={t("orders.row.quantity")}
                                required
                            />
                            <NumberFieldControlled<IOrderRowForm>
                                name="tolerance_quantity_percentage"
                                label={t("orders.row.tolerance_quantity_percentage")}
                            />
                        </Box>

                        <Box sx={{display: 'flex', gap: 1}}>
                            <DateFieldControlled<IOrderRowForm>
                                name="delivery_date_request"
                                label={t("orders.row.delivery_date_request")}
                            />
                            <DateFieldControlled<IOrderRowForm>
                                name="delivery_date_confirmed"
                                label={t("orders.row.delivery_date_confirmed")}
                            />
                        </Box>

                        <Box sx={{display: 'flex', gap: 1}}>
                            <NumberFieldControlled<IOrderRowForm>
                                name="currency_price"
                                label={t("orders.row.currency_price")}
                            />
                            <NumberFieldControlled<IOrderRowForm>
                                name="currency_exchange"
                                label={t("orders.row.currency_exchange")}
                            />
                            <NumberFieldControlled<IOrderRowForm>
                                name="total_currency_price"
                                label={t("orders.row.total_currency_price")}
                            />
                        </Box>

                        <Box sx={{display: 'flex', gap: 1}}>
                            <NumberFieldControlled<IOrderRowForm>
                                name="price"
                                label={t("orders.row.price")}
                            />
                            <NumberFieldControlled<IOrderRowForm>
                                name="total_price"
                                label={t("orders.row.total_price")}
                            />
                        </Box>

                        <Box sx={{display: 'flex', gap: 1}}>
                            <NumberFieldControlled<IOrderRowForm>
                                name="agent_percentage_row"
                                label={t("orders.row.agent_percentage_row")}
                            />
                            <NumberFieldControlled<IOrderRowForm>
                                name="weight"
                                label={t("orders.row.weight")}
                            />
                        </Box>

                        <Box sx={{display: 'flex', gap: 1}}>
                             <NumberFieldControlled<IOrderRowForm>
                                name="shipment_schedule"
                                label={t("orders.row.shipment_schedule")}
                            />
                             <NumberFieldControlled<IOrderRowForm>
                                name="production_schedule"
                                label={t("orders.row.production_schedule")}
                            />
                        </Box>
                    </Stack>
                )}
            />
        </BaseDialog>
    );
});

export default OrderRowsFormDialog;
