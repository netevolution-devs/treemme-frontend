import {usePanel} from "@ui/panel/PanelContext.tsx";
import {useTranslation} from "react-i18next";
import GenericForm from "@features/panels/shared/GenericForm.tsx";
import SelectFieldControlled from "@ui/form/controlled/SelectFieldController.tsx";
import DateFieldControlled from "@ui/form/controlled/DateFieldControlled.tsx";
import FlagCheckBoxFieldControlled from "@ui/form/controlled/FlagCheckBoxFieldControlled.tsx";
import NumberFieldControlled from "@ui/form/controlled/NumberFieldControlled.tsx";
import {Box, Stack} from "@mui/material";
import {forwardRef, useMemo, useRef} from "react";
import type {IDialogActions} from "@ui/dialog/IDialogActions.ts";
import BaseDialog from "@ui/dialog/BaseDialog.tsx";
import type {IOrderRow} from "@features/panels/orders/customer-orders/order-rows/api/IOrderRow.ts";
import type {ICustomerOrdersStoreState} from "@features/panels/orders/customer-orders/CustomerOrdersPanel.tsx";
import {measurementUnitApi} from "@features/panels/shared/api/measurement-unit/measurementUnitApi.ts";
import {orderRowApi} from "@features/panels/orders/customer-orders/order-rows/api/orderRowApi.ts";
import {articleApi} from "@features/panels/products/articles/api/articleApi.ts";
import {customerOrderApi} from "@features/panels/orders/customer-orders/api/customerOrderApi.tsx";
import {currencyApi} from "@features/panels/shared/api/currency/currencyApi.ts";
import TextFieldValue from "@ui/form/controlled/TextFieldValue.tsx";
import CurrencyWatcher from "@features/panels/shared/hooks/CurrencyWatcher.tsx";
import CustomButton, {NewButton} from "@features/panels/shared/CustomButton.tsx";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import DyeFormDialog from "@features/panels/orders/customer-orders/order-rows/dye/DyeFormDialog.tsx";
import RefinementFormDialog
    from "@features/panels/orders/customer-orders/order-rows/refinement/RefinementFormDialog.tsx";
import {openDialog} from "@ui/dialog/dialogHelper.ts";
import SettingsInputHdmiIcon from "@mui/icons-material/SettingsInputHdmi";
import {selectionApi} from "@features/panels/products/selection/api/selectionApi.ts";
import CurrenciesExchangeFormDialog
    from "@features/panels/commercial/currenciesExchange/exchange/CurrenciesExchangeFormDialog.tsx";

type Props = unknown;

export type IOrderRowForm = Omit<IOrderRow,
    'id' |
    'article' |
    'measurement_unit' |
    'currency' |
    'client_order' |
    'available_quantity' |
    'quantity' |
    'selection'
> & {
    id?: number;
    // product_id: number;
    article_id: number | null;
    measurement_unit_id: number | null;
    currency_id: number | null;
    client_order_id: number;
    quantity: number | null;
    selection_id: number | null;
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
    const {data: currencies = []} = currencyApi.useGetList();
    const {data: selections = []} = selectionApi.useGetList();

    const currencyOptions = useMemo(() =>
        currencies.map(c => ({value: c.id, label: `${c.abbreviation} - ${c.name}`})),
    [currencies]);

    const dyeDialogRef = useRef<IDialogActions | null>(null);
    const refinementDialogRef = useRef<IDialogActions | null>(null);

    const addExchangeDialogRef = useRef<IDialogActions | null>(null);

    return (
        <BaseDialog ref={ref} sx={{p: 2}}>
            <DyeFormDialog ref={dyeDialogRef}/>
            <RefinementFormDialog ref={refinementDialogRef}/>

            <GenericForm<IOrderRowForm, IOrderRow>
                dialogMode
                dialogRef={ref}
                selectedId={selectedOrderRowId}
                entity={orderRow}
                emptyValues={{
                    // product_id: 0,
                    measurement_unit_id: measurementUnits.find(x => x.name === "Metri quadrati")?.id || null,
                    currency_id: currencies.find((x) => x.abbreviation === 'EUR')?.id ?? null,
                    processed: false,
                    cancelled: false,
                    weight: null,
                    quantity: null,
                    price: null,
                    total_price: null,
                    currency_price: null,
                    currency_exchange: 1,
                    total_currency_price: null,
                    agent_percentage_row: null,
                    tolerance_quantity_percentage: 40,
                    shipment_schedule: null,
                    production_schedule: null,
                    delivery_date_request: null,
                    delivery_date_confirmed: null,
                    article_id: null,
                    client_order_id: selectedCustomerOrderId ?? 0,
                    selection_id: null,
                }}
                mapEntityToForm={(x) => ({
                    // product_id: x.product.id,
                    measurement_unit_id: x.measurement_unit.id,
                    currency_id: x.currency?.id ?? null,
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
                    client_order_id: selectedCustomerOrderId ?? 0,
                    selection_id: x.selection.id ?? null,
                })}
                create={(payload) => createRow({
                    ...payload,
                    article_id: payload.article_id as number,
                    measurement_unit_id: payload.measurement_unit_id as number,
                    client_order_id: selectedCustomerOrderId as number
                })}
                update={(id, payload) => updateRow({
                    id,
                    payload: {
                        ...payload,
                        article_id: payload.article_id as number,
                        measurement_unit_id: payload.measurement_unit_id as number,
                        client_order_id: selectedCustomerOrderId as number
                    }
                })}
                remove={(id) => deleteRow(id)}
                isSaving={isPosting || isPutting}
                isDeleting={isDeleting}
                onClearSelection={() => setUIState({selectedOrderRowId: null})}
                validateBeforeSave={(v) => !!v.article_id && !!v.measurement_unit_id && !!v.quantity}
                extraButtons={[
                    <CustomButton
                        label={t("orders.row.dye")}
                        color={"primary"}
                        icon={<ColorLensIcon/>}
                        onClick={() => openDialog(dyeDialogRef)}
                        isEnable={!!selectedOrderRowId}
                    />,
                    <CustomButton
                        label={t("orders.row.refinement")}
                        color={"success"}
                        icon={<SettingsInputHdmiIcon/>}
                        onClick={() => openDialog(refinementDialogRef)}
                        isEnable={!!selectedOrderRowId}
                    />,
                ]}
                renderFields={() => (
                    <Stack gap={1}>
                        <CurrenciesExchangeFormDialog ref={addExchangeDialogRef}/>

                        <CurrencyWatcher currencies={currencies} exchangeFieldName={"currency_exchange"}/>
                        <Box sx={{display: 'flex', gap: 1, alignItems: 'center'}}>
                            <SelectFieldControlled<IOrderRowForm>
                                name="article_id"
                                label={t("orders.row.article")}
                                options={articles?.map(p => ({value: p.id, label: `${p.code} - ${p.name}`})) || []}
                                required
                            />
                            <FlagCheckBoxFieldControlled<IOrderRowForm>
                                name="processed"
                                label={t("orders.row.processed")}
                                disabled
                            />
                            <FlagCheckBoxFieldControlled<IOrderRowForm>
                                name="cancelled"
                                label={t("orders.row.cancelled")}
                                disabled
                            />
                        </Box>

                        <SelectFieldControlled<IOrderRowForm>
                            name={"selection_id"}
                            label={t("orders.row.selection")}
                            options={selections?.map(s => ({value: s.id, label: s.name})) || []}
                        />

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

                        <Box sx={{display: 'flex', gap: 1, mb: 1.5}}>
                            <DateFieldControlled<IOrderRowForm>
                                name="delivery_date_request"
                                label={t("orders.row.delivery_date_request")}
                            />
                            <DateFieldControlled<IOrderRowForm>
                                name="delivery_date_confirmed"
                                label={t("orders.row.delivery_date_confirmed")}
                            />
                        </Box>

                        {/*<Box sx={{display: 'flex', gap: 1}}>*/}
                        {/*    <SelectFieldControlled<IOrderRowForm>*/}
                        {/*        name="currency_id"*/}
                        {/*        label={t("orders.row.currency")}*/}
                        {/*        options={currencyOptions}*/}
                        {/*    />*/}
                        {/*    <NumberFieldControlled<IOrderRowForm>*/}
                        {/*        name="currency_price"*/}
                        {/*        label={t("orders.row.currency_price")}*/}
                        {/*    />*/}
                        {/*    <NumberFieldControlled<IOrderRowForm>*/}
                        {/*        name="currency_exchange"*/}
                        {/*        label={t("orders.row.currency_exchange")}*/}
                        {/*    />*/}
                        {/*    <NumberFieldControlled<IOrderRowForm>*/}
                        {/*        name="total_currency_price"*/}
                        {/*        label={t("orders.row.total_currency_price")}*/}
                        {/*    />*/}
                        {/*</Box>*/}

                        {/*<Box sx={{display: 'flex', gap: 1}}>*/}
                        {/*    <NumberFieldControlled<IOrderRowForm>*/}
                        {/*        name="price"*/}
                        {/*        label={t("orders.row.price")}*/}
                        {/*    />*/}
                        {/*    <NumberFieldControlled<IOrderRowForm>*/}
                        {/*        name="total_price"*/}
                        {/*        label={t("orders.row.total_price")}*/}
                        {/*    />*/}
                        {/*</Box>*/}

                        <Box sx={{display: 'flex', gap: 1}}>
                            <SelectFieldControlled<IOrderRowForm>
                                name="currency_id"
                                label={t("orders.row.currency")}
                                options={currencyOptions}
                            />
                            <NumberFieldControlled<IOrderRowForm>
                                name="price"
                                label={t("orders.row.price")}
                            />
                            <TextFieldValue
                                label={t("orders.row.total_price")}
                                value={orderRow?.total_price ?? undefined}
                                isFilled={!!orderRow}
                            />
                        </Box>

                        <Box sx={{display: 'flex', gap: 1}}>
                            <NumberFieldControlled<IOrderRowForm>
                                name="currency_exchange"
                                label={t("orders.row.currency_exchange")}
                            />
                            <Box sx={{mb: 1}}>
                                <NewButton
                                    sx={{pr: 0}}
                                    onClick={() => openDialog(addExchangeDialogRef)}
                                    disableLabel
                                />
                            </Box>
                            {/*<NumberFieldControlled<IOrderRowForm>*/}
                            {/*    name="currency_price"*/}
                            {/*    label={t("orders.row.currency_price")}*/}
                            {/*/>*/}
                            <TextFieldValue
                                label={t("orders.row.currency_price")}
                                value={orderRow?.currency_price ?? undefined}
                                isFilled={!!orderRow}
                            />
                            <TextFieldValue
                                label={t("orders.row.total_currency_price")}
                                value={orderRow?.total_currency_price ?? undefined}
                                isFilled={!!orderRow}
                            />
                        </Box>

                        {/*<Box sx={{display: 'flex', gap: 1}}>*/}
                        {/*    <NumberFieldControlled<IOrderRowForm>*/}
                        {/*        name="agent_percentage_row"*/}
                        {/*        label={t("orders.row.agent_percentage_row")}*/}
                        {/*    />*/}
                        {/*    <NumberFieldControlled<IOrderRowForm>*/}
                        {/*        name="weight"*/}
                        {/*        label={t("orders.row.weight")}*/}
                        {/*    />*/}
                        {/*</Box>*/}

                        {/*<Box sx={{display: 'flex', gap: 1}}>*/}
                        {/*     <NumberFieldControlled<IOrderRowForm>*/}
                        {/*        name="shipment_schedule"*/}
                        {/*        label={t("orders.row.shipment_schedule")}*/}
                        {/*    />*/}
                        {/*     <NumberFieldControlled<IOrderRowForm>*/}
                        {/*        name="production_schedule"*/}
                        {/*        label={t("orders.row.production_schedule")}*/}
                        {/*    />*/}
                        {/*</Box>*/}
                    </Stack>
                )}
            />
        </BaseDialog>
    );
});

export default OrderRowsFormDialog;
