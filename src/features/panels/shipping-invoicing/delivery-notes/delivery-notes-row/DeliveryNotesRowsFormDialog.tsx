import {usePanel} from "@ui/panel/PanelContext.tsx";
import {useTranslation} from "react-i18next";
import GenericForm from "@features/panels/shared/GenericForm.tsx";
import SelectFieldControlled from "@ui/form/controlled/SelectFieldController.tsx";
import NumberFieldControlled from "@ui/form/controlled/NumberFieldControlled.tsx";
import TextFieldControlled from "@ui/form/controlled/TextFieldControlled.tsx";
import {Box, Stack, Typography} from "@mui/material";
import {forwardRef, useMemo, useRef} from "react";
import type {IDialogActions} from "@ui/dialog/IDialogActions.ts";
import BaseDialog from "@ui/dialog/BaseDialog.tsx";
import type {
    IDeliveryNoteRow
} from "@features/panels/shipping-invoicing/delivery-notes/delivery-notes-row/api/IDeliveryNoteRow.ts";
import type {IDeliveryNotesStoreState} from "@features/panels/shipping-invoicing/delivery-notes/DeliveryNotesPanel.tsx";
import {measurementUnitApi} from "@features/panels/shared/api/measurement-unit/measurementUnitApi.ts";
import {
    deliveryNoteRowApi,
} from "@features/panels/shipping-invoicing/delivery-notes/delivery-notes-row/api/deliveryNoteRowApi.ts";
import {currencyApi} from "@features/panels/shared/api/currency/currencyApi.ts";
import TextFieldValue from "@shared/ui/form/controlled/TextFieldValue.tsx";
import {selectionApi} from "@features/panels/products/selection/api/selectionApi.ts";
import BatchesCompositionList from "@features/panels/production/batches/composition/BatchesCompositionList.tsx";
import CurrencyWatcher from "@features/panels/shared/hooks/CurrencyWatcher.tsx";
import {workingApi} from "@features/panels/production/workings/api/workingApi.ts";
import {useWatch} from "react-hook-form";
import CurrenciesExchangeFormDialog
    from "@features/panels/commercial/currenciesExchange/exchange/CurrenciesExchangeFormDialog.tsx";
import {NewButton} from "@features/panels/shared/CustomButton.tsx";
import {openDialog} from "@ui/dialog/dialogHelper.ts";
import {deliveryNoteApi} from "@features/panels/shipping-invoicing/delivery-notes/api/deliveryNoteApi.ts";
import useGetBatchAvailability
    from "@features/panels/shipping-invoicing/subcontracting-not-returned/api/useGetBatchAvailability.ts";
import {batchApi} from "@features/panels/production/batches/api/batchApi.ts";

type Props = unknown;

export type IDeliveryNoteRowForm = Omit<IDeliveryNoteRow,
    'id' |
    'batch' |
    'measurement_unit' |
    'currency' |
    'selection' |
    'pieces' |
    'quantity' |
    'processing'
> & {
    batch_id: number | null;
    measurement_unit_id: number | null;
    currency_id: number | null;
    selection_id: number | null;
    ddt_id: number;
    pieces: number | null;
    quantity: number | null;
    processing_id: number | null;
};

const DeliveryNotesRowsFormDialog = forwardRef<IDialogActions, Props>((_props, ref) => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IDeliveryNotesStoreState>();
    const selectedDeliveryNoteId = useStore(state => state.uiState.selectedDeliveryNoteId);
    const selectedDeliveryNoteRowId = useStore(state => state.uiState.selectedDeliveryNoteRowId);
    const setUIState = useStore(state => state.setUIState);

    const {useGetDetail, usePost, usePut, useDelete} = deliveryNoteRowApi;
    const {data: deliveryNoteRow} = useGetDetail(selectedDeliveryNoteRowId);

    const {mutateAsync: createRow, isPending: isPosting} = usePost({
        invalidateQueries: ['DELIVERY-NOTE', String(selectedDeliveryNoteId), "DDT-ROW-NOT-RETURNED", "LIST"]
    });
    const {mutateAsync: updateRow, isPending: isPutting} = usePut({
        invalidateQueries: ['DELIVERY-NOTE', String(selectedDeliveryNoteId)]
    });
    const {mutateAsync: deleteRow, isPending: isDeleting} = useDelete({
        invalidateQueries: ['DELIVERY-NOTE', String(selectedDeliveryNoteId)]
    });

    const {data: currencies = []} = currencyApi.useGetList();

    return (
        <BaseDialog ref={ref} sx={{p: 2}}>
            <GenericForm<IDeliveryNoteRowForm, IDeliveryNoteRow, IDeliveryNotesStoreState>
                dialogMode
                dialogRef={ref}
                selectedId={selectedDeliveryNoteRowId}
                entity={deliveryNoteRow}
                emptyValues={{
                    batch_id: null,
                    measurement_unit_id: null,
                    currency_id: currencies.find((x) => x.abbreviation === 'EUR')?.id ?? null,
                    selection_id: null,
                    order_note: "",
                    pieces: null,
                    quantity: null,
                    price: null,
                    total_value: null,
                    currency_price: null,
                    currency_change: 1,
                    currency_total_value: null,
                    kg_weight: null,
                    row_note: "",
                    whole_piece: null,
                    half_piece: 0,
                    ddt_id: selectedDeliveryNoteId ?? 0,
                    processing_id: null,
                }}
                mapEntityToForm={(x) => ({
                    batch_id: x.batch?.id || null,
                    measurement_unit_id: x.measurement_unit?.id || null,
                    currency_id: x.currency?.id ?? null,
                    selection_id: x.selection?.id ?? null,
                    order_note: x.order_note,
                    pieces: x.pieces,
                    quantity: x.quantity,
                    price: x.price,
                    total_value: x.total_value,
                    currency_price: x.currency_price,
                    currency_change: x.currency_change,
                    currency_total_value: x.currency_total_value,
                    kg_weight: x.kg_weight,
                    row_note: x.row_note || "",
                    whole_piece: x.whole_piece,
                    half_piece: x.half_piece || 0,
                    ddt_id: selectedDeliveryNoteId ?? 0,
                    processing_id: x.processing?.id ?? 0
                })}
                create={(payload) => createRow(payload)}
                update={(id, payload) => updateRow({id, payload})}
                remove={(id) => deleteRow(id)}
                isSaving={isPosting || isPutting}
                isDeleting={isDeleting}
                onClearSelection={() => setUIState({selectedDeliveryNoteRowId: null})}
                validateBeforeSave={(v) => !!v.batch_id && !!v.pieces}
                renderFields={() => (
                    <DeliverNotesRowsFormFields/>
                )}
            />

            {deliveryNoteRow && (
                <>
                    <Typography sx={{mb: 1, fontSize: 16, mt: 2}}>{t("shipping.composition-title")}</Typography>
                    <BatchesCompositionList
                        customBatchId={deliveryNoteRow?.batch?.id as number}
                        enableToolbar={false}
                    />
                </>
            )}
        </BaseDialog>
    );
});

const DeliverNotesRowsFormFields = () => {
    const {t} = useTranslation(["form"]);
    const {useStore} = usePanel<unknown, IDeliveryNotesStoreState>();
    const selectedDeliveryNoteRowId = useStore(state => state.uiState.selectedDeliveryNoteRowId);
    const selectedDeliveryNoteId = useStore(state => state.uiState.selectedDeliveryNoteId);

    const {data: deliveryNote} = deliveryNoteApi.useGetDetail(selectedDeliveryNoteId);
    const {data: deliveryNoteRow} = deliveryNoteRowApi.useGetDetail(selectedDeliveryNoteRowId);

    const {data: batches = []} = useGetBatchAvailability();
    const {data: measurementUnits = []} = measurementUnitApi.useGetList();
    const {data: currencies = []} = currencyApi.useGetList();
    const {data: selections = []} = selectionApi.useGetList();
    const {data: workings = []} = workingApi.useGetList();

    const batchesList = [
        deliveryNoteRow?.batch,
        ...batches
    ].filter((x) => x !== undefined);

    const currencyOptions = useMemo(() =>
            currencies.map(c => ({value: c.id, label: `${c.abbreviation} - ${c.name}`})),
        [currencies]);

    const addExchangeDialogRef = useRef<IDialogActions | null>(null);

    const isEuro = (currencyId: number | null) => (
        currencyId === currencies.find(c => c.abbreviation === 'EUR')?.id
    )

    const isSell = useMemo(() => {
        return deliveryNote?.reason.name === "Vendita"
    }, [deliveryNote])

    const watchedBatchId = useWatch<IDeliveryNoteRowForm>({name: "batch_id"});
    const watchedCurrencyId = useWatch<IDeliveryNoteRowForm>({name: "currency_id"});
    const watchedCurrencyValue = useWatch<IDeliveryNoteRowForm>({name: "currency_change"});

    const {data: batch} = batchApi.useGetDetail(watchedBatchId as number);

    const productName = deliveryNoteRow?.batch.article?.name || deliveryNoteRow?.batch.leather?.name || batch?.leather?.name || batch?.article?.name;

    return (
        <Stack gap={1}>
            <CurrencyWatcher
                currencies={currencies}
                exchangeFieldName={"currency_change"}
            />
            <CurrenciesExchangeFormDialog
                ref={addExchangeDialogRef}
                currencyId={watchedCurrencyId as number}
                currencyValue={watchedCurrencyValue as number > 0
                    ? watchedCurrencyValue as number
                    : null
                }
            />

            <Box sx={{display: 'flex', gap: 1}}>
                <SelectFieldControlled<IDeliveryNoteRowForm>
                    name="batch_id"
                    label={t("production.batch.batch_code")}
                    options={batchesList.map(b => ({value: b.id, label: b.batch_code}))}
                    required
                />
                <NumberFieldControlled<IDeliveryNoteRowForm>
                    name="pieces"
                    label={t("production.batch.selections.pieces")}
                    required
                    deactivated={!watchedBatchId}
                    max={batch?.stock_items as number}
                    precision={0}
                />
                {/*<NumberFieldControlled<IDeliveryNoteRowForm>*/}
                {/*    name="kg_weight"*/}
                {/*    label={t("orders.row.weight")}*/}
                {/*/>*/}
            </Box>

            {!isSell && (
                <Box sx={{display: 'flex', gap: 1}}>
                    <SelectFieldControlled<IDeliveryNoteRowForm>
                        name="selection_id"
                        label={t("production.batch.selection")}
                        options={selections.map(s => ({value: s.id, label: s.name}))}
                    />
                    <SelectFieldControlled<IDeliveryNoteRowForm>
                        name="processing_id"
                        label={t("production.batch.workings")}
                        options={workings.map(s => ({value: s.id, label: s.name}))}
                    />
                </Box>
            )}

            <Box sx={{display: 'flex', gap: 1, alignItems: 'center', mb: 1}}>
                <TextFieldValue
                    label={t("orders.row.product")}
                    value={productName}
                    isFilled={!!deliveryNoteRow}
                />
            </Box>

            <Box sx={{display: 'flex', gap: 1}}>
                <SelectFieldControlled<IDeliveryNoteRowForm>
                    name="measurement_unit_id"
                    label={t("orders.row.measurement_unit")}
                    options={measurementUnits.map(mu => ({value: mu.id, label: mu.name}))}
                    required
                />
                <NumberFieldControlled<IDeliveryNoteRowForm>
                    name="quantity"
                    label={t("orders.row.quantity")}
                    required
                />
                <NumberFieldControlled<IDeliveryNoteRowForm>
                    name="half_piece"
                    label={t("shipping.ddt_rows.half_piece")}
                />
                {/*<NumberFieldControlled<IDeliveryNoteRowForm>*/}
                {/*    name="whole_piece"*/}
                {/*    label={t("shipping.ddt_rows.whole_piece")}*/}
                {/*/>*/}
                <TextFieldValue
                    label={t("shipping.ddt_rows.whole_piece")}
                    value={deliveryNoteRow?.whole_piece as number}
                    isFilled={!!deliveryNoteRow}
                />
            </Box>

            <Box sx={{display: 'flex', gap: 1}}>
                <SelectFieldControlled<IDeliveryNoteRowForm>
                    name="currency_id"
                    label={t("orders.row.currency")}
                    options={currencyOptions}
                />
                <NumberFieldControlled<IDeliveryNoteRowForm>
                    name="price"
                    label={t("orders.row.price")}
                />
                <TextFieldValue
                    label={t("orders.row.total_price")}
                    value={deliveryNoteRow?.total_value ?? undefined}
                    isFilled={!!deliveryNoteRow}
                />
            </Box>

            <Box sx={{display: 'flex', gap: 1}}>
                <NumberFieldControlled<IDeliveryNoteRowForm>
                    name="currency_change"
                    label={t("orders.row.currency_exchange")}
                    precision={3}
                    deactivated={isEuro(watchedCurrencyId as number)}
                />
                <Box sx={{mb: 1}}>
                    <NewButton
                        sx={{pr: 0}}
                        onClick={() => openDialog(addExchangeDialogRef)}
                        isEnable={!isEuro(watchedCurrencyId as number)}
                        disableLabel
                    />
                </Box>
                {/*<NumberFieldControlled<IDeliveryNoteRowForm>*/}
                {/*    name="currency_price"*/}
                {/*    label={t("orders.row.currency_price")}*/}
                {/*/>*/}
                <TextFieldValue
                    label={t("orders.row.currency_price")}
                    value={deliveryNoteRow?.currency_price ?? undefined}
                    isFilled={!!deliveryNoteRow}
                />
                <TextFieldValue
                    label={t("orders.row.total_currency_price")}
                    value={deliveryNoteRow?.currency_total_value ?? undefined}
                    isFilled={!!deliveryNoteRow}
                />
            </Box>

            <Box sx={{display: 'flex', gap: 1}}>
                <TextFieldControlled<IDeliveryNoteRowForm>
                    name="row_note"
                    label={t("shipping.ddt_rows.row_note")}
                />
            </Box>
        </Stack>
    )
}

export default DeliveryNotesRowsFormDialog;
