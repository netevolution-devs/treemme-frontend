import {usePanel} from "@ui/panel/PanelContext.tsx";
import {useTranslation} from "react-i18next";
import GenericForm from "@features/panels/shared/GenericForm.tsx";
import SelectFieldControlled from "@ui/form/controlled/SelectFieldController.tsx";
import NumberFieldControlled from "@ui/form/controlled/NumberFieldControlled.tsx";
import TextFieldControlled from "@ui/form/controlled/TextFieldControlled.tsx";
import {Box, Stack} from "@mui/material";
import {forwardRef, useMemo} from "react";
import type {IDialogActions} from "@ui/dialog/IDialogActions.ts";
import BaseDialog from "@ui/dialog/BaseDialog.tsx";
import type {IDeliveryNoteRow} from "@features/panels/shipping-invoicing/delivery-notes/delivery-notes-row/api/IDeliveryNoteRow.ts";
import type {IDeliveryNotesStoreState} from "@features/panels/shipping-invoicing/delivery-notes/DeliveryNotesPanel.tsx";
import {measurementUnitApi} from "@features/panels/shared/api/measurement-unit/measurementUnitApi.ts";
import {deliveryNoteRowApi, type IDeliveryNoteRowPayload} from "@features/panels/shipping-invoicing/delivery-notes/delivery-notes-row/api/deliveryNoteRowApi.ts";
import {currencyApi} from "@features/panels/shared/api/currency/currencyApi.ts";
import {batchApi} from "@features/panels/production/batches/api/batchApi.ts";

type Props = unknown;

export type IDeliveryNoteRowForm = Omit<IDeliveryNoteRow,
    'id' |
    'batch' |
    'measurement_unit' |
    'currency'
> & {
    batch_id: number;
    measurement_unit_id: number;
    currency_id: number | null;
    ddt_id: number;
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
        invalidateQueries: ['DELIVERY-NOTE', String(selectedDeliveryNoteId)]
    });
    const {mutateAsync: updateRow, isPending: isPutting} = usePut({
        invalidateQueries: ['DELIVERY-NOTE', String(selectedDeliveryNoteId)]
    });
    const {mutateAsync: deleteRow, isPending: isDeleting} = useDelete({
        invalidateQueries: ['DELIVERY-NOTE', String(selectedDeliveryNoteId)]
    });

    const {data: batches = []} = batchApi.useGetList();
    const {data: measurementUnits = []} = measurementUnitApi.useGetList();
    const {data: currencies = []} = currencyApi.useGetList();

    const currencyOptions = useMemo(() =>
        currencies.map(c => ({value: c.id, label: `${c.abbreviation} - ${c.name}`})),
    [currencies]);

    return (
        <BaseDialog ref={ref} sx={{p: 2}}>
            <GenericForm<IDeliveryNoteRowForm, IDeliveryNoteRow, IDeliveryNotesStoreState>
                dialogMode
                dialogRef={ref}
                selectedId={selectedDeliveryNoteRowId}
                entity={deliveryNoteRow}
                emptyValues={{
                    batch_id: 0,
                    measurement_unit_id: 0,
                    currency_id: null,
                    order_note: "",
                    pieces: 0,
                    quantity: 0,
                    total_value: null,
                    currency_price: null,
                    currency_total_value: null,
                    kg_weight: null,
                    row_note: "",
                    whole_piece: null,
                    half_piece: null,
                    ddt_id: selectedDeliveryNoteId ?? 0
                }}
                mapEntityToForm={(x) => ({
                    batch_id: x.batch.id,
                    measurement_unit_id: x.measurement_unit.id,
                    currency_id: x.currency?.id ?? null,
                    order_note: x.order_note,
                    pieces: x.pieces,
                    quantity: x.quantity,
                    total_value: x.total_value,
                    currency_price: x.currency_price,
                    currency_total_value: x.currency_total_value,
                    kg_weight: x.kg_weight,
                    row_note: x.row_note || "",
                    whole_piece: x.whole_piece,
                    half_piece: x.half_piece,
                    ddt_id: selectedDeliveryNoteId ?? 0
                })}
                create={(payload) => createRow({
                    ...payload,
                    ddt_id: selectedDeliveryNoteId as number
                } as IDeliveryNoteRowPayload)}
                update={(id, payload) => updateRow({
                    id,
                    payload: {
                        ...payload,
                        ddt_id: selectedDeliveryNoteId as number
                    } as IDeliveryNoteRowPayload
                })}
                remove={(id) => deleteRow(id)}
                isSaving={isPosting || isPutting}
                isDeleting={isDeleting}
                onClearSelection={() => setUIState({selectedDeliveryNoteRowId: null})}
                renderFields={() => (
                    <Stack gap={2}>
                        <Box sx={{display: 'flex', gap: 1}}>
                            <SelectFieldControlled<IDeliveryNoteRowForm>
                                name="batch_id"
                                label={t("production.batch.batch_code")}
                                options={batches.map(b => ({value: b.id, label: b.batch_code}))}
                                required
                            />
                            <SelectFieldControlled<IDeliveryNoteRowForm>
                                name="measurement_unit_id"
                                label={t("orders.row.measurement_unit")}
                                options={measurementUnits.map(mu => ({value: mu.id, label: mu.name}))}
                                required
                            />
                        </Box>

                        <Box sx={{display: 'flex', gap: 1}}>
                            <NumberFieldControlled<IDeliveryNoteRowForm>
                                name="pieces"
                                label={t("production.batch.selections.pieces")}
                                required
                            />
                            <NumberFieldControlled<IDeliveryNoteRowForm>
                                name="quantity"
                                label={t("orders.row.quantity")}
                                required
                            />
                            <NumberFieldControlled<IDeliveryNoteRowForm>
                                name="kg_weight"
                                label={t("orders.row.weight")}
                            />
                        </Box>

                        <Box sx={{display: 'flex', gap: 1}}>
                            <NumberFieldControlled<IDeliveryNoteRowForm>
                                name="whole_piece"
                                label={t("production.batch.selections.pieces")}
                            />
                            <NumberFieldControlled<IDeliveryNoteRowForm>
                                name="half_piece"
                                label={t("production.batch.selections.pieces")}
                            />
                        </Box>

                        <Box sx={{display: 'flex', gap: 1}}>
                            <SelectFieldControlled<IDeliveryNoteRowForm>
                                name="currency_id"
                                label={t("orders.row.currency")}
                                options={currencyOptions}
                            />
                            <NumberFieldControlled<IDeliveryNoteRowForm>
                                name="currency_price"
                                label={t("orders.row.currency_price")}
                            />
                            <NumberFieldControlled<IDeliveryNoteRowForm>
                                name="currency_total_value"
                                label={t("orders.row.total_currency_price")}
                            />
                        </Box>

                        <Box sx={{display: 'flex', gap: 1}}>
                            <NumberFieldControlled<IDeliveryNoteRowForm>
                                name="total_value"
                                label={t("orders.row.total_price")}
                            />
                        </Box>

                        <Box sx={{display: 'flex', gap: 1}}>
                            <TextFieldControlled<IDeliveryNoteRowForm>
                                name="order_note"
                                label={t("orders.order_note")}
                            />
                            <TextFieldControlled<IDeliveryNoteRowForm>
                                name="row_note"
                                label={t("orders.row.notes")}
                            />
                        </Box>
                    </Stack>
                )}
            />
        </BaseDialog>
    );
});

export default DeliveryNotesRowsFormDialog;
