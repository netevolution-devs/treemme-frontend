import {usePanel} from "@ui/panel/PanelContext";
import {useTranslation} from "react-i18next";
import GenericForm from "@features/panels/shared/GenericForm";
import SelectFieldControlled from "@ui/form/controlled/SelectFieldController";
import NumberFieldControlled from "@ui/form/controlled/NumberFieldControlled";
import TextFieldControlled from "@ui/form/controlled/TextFieldControlled";
import {Box, Stack, Typography} from "@mui/material";
import {useMemo, useRef} from "react";
import type {IDialogActions} from "@ui/dialog/IDialogActions";
import type {
    IDeliveryNoteRow
} from "@features/panels/shipping-invoicing/delivery-notes/delivery-notes-row/api/IDeliveryNoteRow";
import {measurementUnitApi} from "@features/panels/shared/api/measurement-unit/measurementUnitApi";
import {
    deliveryNoteRowApi,
} from "@features/panels/shipping-invoicing/delivery-notes/delivery-notes-row/api/deliveryNoteRowApi";
import {currencyApi} from "@features/panels/shared/api/currency/currencyApi";
import TextFieldValue from "@shared/ui/form/controlled/TextFieldValue";
import {selectionApi} from "@features/panels/products/selection/api/selectionApi";
import BatchesCompositionList from "@features/panels/production/batches/composition/BatchesCompositionList";
import CurrencyWatcher from "@features/panels/shared/hooks/CurrencyWatcher";
import {workingApi} from "@features/panels/production/workings/api/workingApi";
import {useWatch} from "react-hook-form";
import CurrenciesExchangeFormDialog
    from "@features/panels/commercial/currenciesExchange/exchange/CurrenciesExchangeFormDialog";
import {NewButton} from "@features/panels/shared/CustomButton";
import {openDialog} from "@ui/dialog/dialogHelper";
import {deliveryNoteApi} from "@features/panels/shipping-invoicing/delivery-notes/api/deliveryNoteApi";
import useGetBatchAvailability
    from "@features/panels/shipping-invoicing/subcontracting-not-returned/api/useGetBatchAvailability";
import {batchApi} from "@features/panels/production/batches/api/batchApi";
import type {ICustomPanelFormProps} from "@ui/panel/store/ICustomPanelPropst";
import {usePanelFormButtons} from "@features/panels/shared/hooks/usePanelFormButtons";
import {usePanelFormLogic} from "@ui/panel/usePanelFormLogin";
import type {
    IDeliveryNotesRowsStoreParams,
    IDeliveryNotesRowsStoreState
} from "@features/panels/shipping-invoicing/delivery-notes/delivery-notes-row/DeliveryNotesRowsPanel";

export type IDeliveryNoteRowForm = Omit<IDeliveryNoteRow,
    'id' |
    'batch' |
    'measurement_unit' |
    'currency' |
    'selection' |
    'pieces' |
    'quantity' |
    'processing' |
    'stock_pieces'
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

const DeliveryNotesRowsForm = ({
                                   initialName,
                                   onSuccess,
                                   extra
                               }: ICustomPanelFormProps<IDeliveryNotesRowsStoreParams>) => {
    const {t} = useTranslation(["form"]);

    const ddtId = extra?.ddt_id ?? 0;
    const ddtRowId = extra?.ddt_row_id ?? 0;

    const {useStore} = usePanel<unknown, IDeliveryNotesRowsStoreState>();
    const selectedStoreId = useStore(state => state.uiState.selectedDeliveryNoteRowId);
    const selectedDeliveryNoteRowId = ddtRowId || selectedStoreId;

    const floatingPanelUUID = extra?.panelId as string;

    const {setFormState} = usePanelFormButtons();
    const {handlePanelSuccess} = usePanelFormLogic({
        initialName,
        selectedId: selectedDeliveryNoteRowId,
        onSuccess,
        setFormState
    });

    const {useGetDetail, usePost, usePut, useDelete} = deliveryNoteRowApi;
    const {data: deliveryNoteRow} = useGetDetail(selectedDeliveryNoteRowId);

    const {mutateAsync: createRow, isPending: isPosting} = usePost({
        invalidateQueries: ['DELIVERY-NOTE', String(ddtId), "DDT-ROW-NOT-RETURNED", "LIST"]
    });
    const {mutateAsync: updateRow, isPending: isPutting} = usePut({
        invalidateQueries: ['DELIVERY-NOTE', String(ddtId)]
    });
    const {mutateAsync: deleteRow, isPending: isDeleting} = useDelete({
        invalidateQueries: ['DELIVERY-NOTE', String(ddtId)]
    });

    const {data: currencies = []} = currencyApi.useGetList();

    return (
        <Box sx={{p: 0}}>
            <GenericForm<IDeliveryNoteRowForm, IDeliveryNoteRow, IDeliveryNotesRowsStoreState>
                onSuccess={handlePanelSuccess}
                dialogMode
                floatingPanelMode
                floatingPanelUUID={floatingPanelUUID}
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
                    ddt_id: ddtId,
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
                    ddt_id: ddtId,
                    processing_id: x.processing?.id ?? 0
                })}
                create={(payload) => createRow(payload)}
                update={(id, payload) => updateRow({id, payload})}
                remove={(id) => deleteRow(id)}
                isSaving={isPosting || isPutting}
                isDeleting={isDeleting}
                // onClearSelection={() => setUIState({selectedDeliveryNoteRowId: null})}
                validateBeforeSave={(v) => !!v.batch_id && !!v.pieces}
                renderFields={() => (
                    <DeliverNotesRowsFormFields ddtId={ddtId} ddtRowId={ddtRowId}/>
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
        </Box>
    );
};

const DeliverNotesRowsFormFields = ({ddtId, ddtRowId}: { ddtId: number, ddtRowId: number }) => {
    const {t} = useTranslation(["form"]);

    const {data: deliveryNote} = deliveryNoteApi.useGetDetail(ddtId);
    const {data: deliveryNoteRow} = deliveryNoteRowApi.useGetDetail(ddtRowId);

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

export default DeliveryNotesRowsForm;
