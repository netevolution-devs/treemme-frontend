import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {IBatchesStoreState} from "@features/panels/production/batches/BatchesPanel.tsx";
import {batchApi, type IBatchesPayload} from "@features/panels/production/batches/api/batchApi.ts";
import {batchTypeApi} from "@features/panels/production/batches/api/batch-type/batchTypeApi.ts";
import GenericForm from "@features/panels/shared/GenericForm.tsx";
import type {IBatch} from "@features/panels/production/batches/api/IBatch.ts";
import {leatherApi} from "@features/panels/leathers/leathers/api/leatherApi.ts";
import {measurementUnitApi} from "@features/panels/shared/api/measurement-unit/measurementUnitApi.ts";
import TextFieldControlled from "@ui/form/controlled/TextFieldControlled.tsx";
import SelectFieldControlled from "@ui/form/controlled/SelectFieldController.tsx";
import FlagCheckBoxFieldControlled from "@ui/form/controlled/FlagCheckBoxFieldControlled.tsx";
import TextFieldValue from "@ui/form/controlled/TextFieldValue.tsx";
import DateFieldControlled from "@ui/form/controlled/DateFieldControlled.tsx";
import {Box} from "@mui/material";
import NumberFieldControlled from "@ui/form/controlled/NumberFieldControlled.tsx";
import CustomButton from "@features/panels/shared/CustomButton.tsx";
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import {openDialog} from "@ui/dialog/dialogHelper.ts";
import type {IDialogActions} from "@ui/dialog/IDialogActions.ts";
import {useRef} from "react";
import BatchesReworkFormDialog from "@features/panels/production/batches/rework/BatchesReworkFormDialog.tsx";
import BatchesSplitFormDialog from "@features/panels/production/batches/split/BatchesSplitFormDialog.tsx";
import CallSplitIcon from '@mui/icons-material/CallSplit';
import dayjs from "dayjs";

export type IBatchesForm = Omit<IBatch, 'id'
    | 'leather'
    | 'batch_type'
    | 'measurement_unit'
    | 'check_user'
    | 'sq_ft_average_expected'
    | 'sq_ft_average_found'
    | 'stock_items'
    | 'stock_quantity'
    | 'batch_code'
    | 'son_batches'
    | 'batch_selections'
    | 'warehouse_movements'
    | 'batch_selections_count'
> & {
    leather_id: number;
    batch_type_id: number;
    measurement_unit_id: number;
};

const BatchesForm = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IBatchesStoreState>();
    const selectedBatchId = useStore((state) => state.uiState.selectedBatchId);
    const setUIState = useStore((state) => state.setUIState);

    const {useGetDetail, usePost, usePut, useDelete} = batchApi;
    const {data: batchItem} = useGetDetail(selectedBatchId);
    const {mutateAsync: createBatch, isPending: isPosting} = usePost();
    const {mutateAsync: updateBatch, isPending: isPutting} = usePut();
    const {mutateAsync: deleteBatch, isPending: isDeleting} = useDelete();

    const {useGetList: useGetBatchTypes} = batchTypeApi;
    const {data: batchTypes = []} = useGetBatchTypes();

    const {useGetList: useGetLeathers} = leatherApi;
    const {data: leathers = []} = useGetLeathers();

    const {useGetList: useGetMeasurementUnits} = measurementUnitApi;
    const {data: measurementUnits = []} = useGetMeasurementUnits();

    const reworkDialogRef = useRef<IDialogActions | null>(null);
    const splitDialogRef = useRef<IDialogActions | null>(null);

    return (
        <>
            <BatchesReworkFormDialog ref={reworkDialogRef}/>
            <BatchesSplitFormDialog ref={splitDialogRef}/>

            <GenericForm<IBatchesForm, IBatch, IBatchesStoreState>
                selectedId={selectedBatchId}
                entity={batchItem}
                emptyValues={{
                    leather_id: 0,
                    batch_type_id: 0,
                    measurement_unit_id: 0,
                    completed: false,
                    checked: false,
                    batch_date: dayjs(Date.now()).format('YYYY-MM-DD'),
                    quantity: 0,
                    selection_note: '',
                    batch_note: '',
                    sampling: false,
                    split_selected: false,
                    check_date: '',
                    check_note: '',
                    pieces: 0,
                }}
                mapEntityToForm={(x) => ({
                    leather_id: x.leather.id,
                    batch_type_id: x.batch_type.id,
                    measurement_unit_id: x.measurement_unit.id,
                    completed: x.completed,
                    checked: x.checked,
                    batch_date: x.batch_date,
                    quantity: x.quantity,
                    selection_note: x.selection_note,
                    batch_note: x.batch_note,
                    sampling: x.sampling,
                    split_selected: x.split_selected,
                    check_date: x.check_date,
                    check_note: x.check_note,
                    pieces: x.pieces,
                })}
                create={(payload) => createBatch(payload as IBatchesPayload)}
                update={(id, payload) => updateBatch({id, payload: payload as IBatchesPayload})}
                remove={(id) => deleteBatch(id)}
                isSaving={isPosting || isPutting}
                isDeleting={isDeleting}
                onClearSelection={() => setUIState({selectedBatchId: null})}
                validateBeforeSave={(v) => !!v.leather_id && !!v.batch_type_id && !!v.quantity && !!v.pieces && !!v.measurement_unit_id && !!v.batch_date}
                extraButtons={[
                    <CustomButton
                        label={t("production.batch.rework")}
                        color={"success"}
                        icon={<SettingsBackupRestoreIcon/>}
                        isEnable={!!selectedBatchId && batchItem?.batch_type.name === "Partita"}
                        onClick={() => {openDialog(reworkDialogRef)}}
                    />,
                    <CustomButton
                        label={t("production.batch.split")}
                        color={"primary"}
                        icon={<CallSplitIcon/>}
                        isEnable={!!selectedBatchId}
                        onClick={() => openDialog(splitDialogRef)}
                    />
                ]}
                renderFields={() => (
                    <>
                        <Box sx={{display: 'flex', flexDirection: 'row', gap: 1}}>
                            <TextFieldValue
                                label={t("production.batch.batch_code")}
                                value={batchItem?.batch_code}
                                isFilled={!!selectedBatchId}
                            />
                            <DateFieldControlled<IBatchesForm>
                                name="batch_date"
                                label={t("production.batch.batch_date")}
                            />
                            <TextFieldValue
                                label={t("production.batch.sq_ft_average_expected")}
                                value={batchItem?.sq_ft_average_expected}
                                isFilled={!!selectedBatchId}
                                precision={2}
                            />
                            <TextFieldValue
                                label={t("production.batch.sq_ft_average_found")}
                                value={batchItem?.sq_ft_average_found}
                                isFilled={!!selectedBatchId}
                                precision={2}
                            />
                            <FlagCheckBoxFieldControlled<IBatchesForm>
                                name="sampling"
                                label={t("production.batch.sampling")}
                                width={120}
                            />
                            <FlagCheckBoxFieldControlled<IBatchesForm>
                                name="completed"
                                label={t("production.batch.completed")}
                                width={120}
                            />
                        </Box>

                        <Box sx={{display: 'flex', flexDirection: 'row', gap: 1}}>
                            <SelectFieldControlled<IBatchesForm>
                                name="batch_type_id"
                                label={t("production.batch.batch_type")}
                                options={batchTypes.map(x => ({label: x.name, value: x.id}))}
                                deactivated={!!selectedBatchId}
                            />
                            <TextFieldValue
                                label={t("production.batch.check_user")}
                                value={batchItem?.check_user ? `${batchItem.check_user.email}` : ""}
                                isFilled={!!selectedBatchId}
                            />
                        </Box>

                        <Box sx={{display: 'flex', flexDirection: 'row', gap: 1}}>
                            <NumberFieldControlled<IBatchesForm>
                                name="pieces"
                                label={t("production.batch.pieces")}
                                precision={0}
                            />
                            <NumberFieldControlled<IBatchesForm>
                                name="quantity"
                                label={t("production.batch.quantity")}
                                precision={2}
                                step={1}
                            />
                            <SelectFieldControlled<IBatchesForm>
                                name="measurement_unit_id"
                                label={t("production.batch.measurement_unit")}
                                options={measurementUnits.map(x => ({label: x.name, value: x.id}))}
                            />
                            <TextFieldValue
                                label={t("production.batch.stock_items")}
                                value={batchItem?.stock_items}
                                isFilled={!!selectedBatchId}
                            />
                            <TextFieldValue
                                label={t("production.batch.stock_quantity")}
                                value={batchItem?.stock_quantity}
                                isFilled={!!selectedBatchId}
                                precision={2}
                            />
                        </Box>

                        <Box sx={{display: 'flex', flexDirection: 'row', gap: 1}}>
                            <SelectFieldControlled<IBatchesForm>
                                name="leather_id"
                                label={t("production.batch.leather")}
                                options={leathers.map(x => ({label: x.name, value: x.id}))}
                                deactivated={!!batchItem}
                            />
                        </Box>

                        <Box sx={{display: 'flex', flexDirection: 'row', gap: 1}}>
                            {/*<FlagCheckBoxFieldControlled<IBatchesForm>*/}
                            {/*    name="checked"*/}
                            {/*    label={t("production.batch.checked")}*/}
                            {/*/>*/}
                            {/*<FlagCheckBoxFieldControlled<IBatchesForm>*/}
                            {/*    name="split_selected"*/}
                            {/*    label={t("production.batch.split_selected")}*/}
                            {/*/>*/}

                            {/* Scelta idk */}
                            <TextFieldControlled<IBatchesForm>
                                name="batch_note"
                                label={t("production.batch.batch_note")}
                                TextFieldProps={{multiline: true, rows: 2}}
                            />
                        </Box>

                        {/*<Box sx={{mt: 2}}>*/}
                        {/*    <Typography variant="subtitle2" sx={{mb: 1}}>{t("production.batch.notes_section")}</Typography>*/}
                        {/*    <TextFieldControlled<IBatchesForm>*/}
                        {/*        name="selection_note"*/}
                        {/*        label={t("production.batch.selection_note")}*/}
                        {/*        TextFieldProps={{multiline: true, rows: 2}}*/}
                        {/*    />*/}
                        {/*</Box>*/}

                        {/*<Box sx={{mt: 2, p: 2, bgcolor: 'action.hover', borderRadius: 1}}>*/}
                        {/*    <Typography variant="subtitle2" sx={{mb: 1}}>{t("production.batch.check_section")}</Typography>*/}
                        {/*    <Box sx={{display: 'flex', flexDirection: 'row', gap: 1}}>*/}
                        {/*        <DateFieldControlled<IBatchesForm>*/}
                        {/*            name="check_date"*/}
                        {/*            label={t("production.batch.check_date")}*/}
                        {/*        />*/}
                        {/*    </Box>*/}
                        {/*    <TextFieldControlled<IBatchesForm>*/}
                        {/*        name="check_note"*/}
                        {/*        label={t("production.batch.check_note")}*/}
                        {/*        TextFieldProps={{multiline: true, rows: 2}}*/}
                        {/*    />*/}
                        {/*</Box>*/}
                    </>
                )}
            />
        </>
    )
}

export default BatchesForm;