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
import {Box, Typography} from "@mui/material";

export type IBatchesForm = Omit<IBatch, 'id'
    | 'leather'
    | 'batch_type'
    | 'measurement_unit'
    | 'check_user'
    | 'sq_ft_average_expected'
    | 'sq_ft_average_found'
    | 'pieces'
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

    return (
        <GenericForm<IBatchesForm, IBatch, IBatchesStoreState>
            selectedId={selectedBatchId}
            entity={batchItem}
            emptyValues={{
                leather_id: 0,
                batch_type_id: 0,
                measurement_unit_id: 0,
                completed: false,
                checked: false,
                batch_code: '',
                batch_date: '',
                quantity: 0,
                stock_items: 0,
                stock_quantity: 0,
                selection_note: '',
                batch_note: '',
                sampling: false,
                split_selected: false,
                check_date: '',
                check_note: '',
            }}
            mapEntityToForm={(x) => ({
                leather_id: x.leather.id,
                batch_type_id: x.batch_type.id,
                measurement_unit_id: x.measurement_unit.id,
                completed: x.completed,
                checked: x.checked,
                batch_code: x.batch_code,
                batch_date: x.batch_date,
                quantity: x.quantity,
                stock_items: x.stock_items,
                stock_quantity: x.stock_quantity,
                selection_note: x.selection_note,
                batch_note: x.batch_note,
                sampling: x.sampling,
                split_selected: x.split_selected,
                check_date: x.check_date,
                check_note: x.check_note,
            })}
            create={(payload) => createBatch(payload as unknown as IBatchesPayload)}
            update={(id, payload) => updateBatch({id, payload: payload as unknown as IBatchesPayload})}
            remove={(id) => deleteBatch(id)}
            isSaving={isPosting || isPutting}
            isDeleting={isDeleting}
            onClearSelection={() => setUIState({selectedBatchId: null})}
            validateBeforeSave={(v) => !!v.leather_id && !!v.batch_type_id && !!v.batch_code}
            renderFields={() => (
                <>
                    <Box sx={{display: 'flex', flexDirection: 'row', gap: 1}}>
                        <TextFieldControlled<IBatchesForm>
                            name="batch_code"
                            label={t("production.batch.batch_code")}
                            required
                        />
                        <DateFieldControlled<IBatchesForm>
                            name="batch_date"
                            label={t("production.batch.batch_date")}
                        />
                        <TextFieldValue
                            label={t("production.batch.sq_ft_average_expected")}
                            value={batchItem?.sq_ft_average_expected}
                            isFilled={!!selectedBatchId}
                        />
                        <TextFieldValue
                            label={t("production.batch.sq_ft_average_found")}
                            value={batchItem?.sq_ft_average_found}
                            isFilled={!!selectedBatchId}
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
                            required
                        />
                        <TextFieldValue
                            label={t("production.batch.check_user")}
                            value={batchItem?.check_user ? `${batchItem.check_user.email}` : ""}
                            isFilled={!!selectedBatchId}
                        />
                    </Box>

                    <Box sx={{display: 'flex', flexDirection: 'row', gap: 1, mt: 2, mb: 1}}>
                        <TextFieldValue
                            label={t("production.batch.pieces")}
                            value={batchItem?.pieces}
                            isFilled={!!selectedBatchId}
                        />
                        <TextFieldControlled<IBatchesForm>
                            name="quantity"
                            label={t("production.batch.quantity")}
                        />
                        <SelectFieldControlled<IBatchesForm>
                            name="measurement_unit_id"
                            label={t("production.batch.measurement_unit")}
                            options={measurementUnits.map(x => ({label: x.name, value: x.id}))}
                        />
                        <TextFieldControlled<IBatchesForm>
                            name="stock_items"
                            label={t("production.batch.stock_items")}
                        />
                        <TextFieldControlled<IBatchesForm>
                            name="stock_quantity"
                            label={t("production.batch.stock_quantity")}
                        />
                    </Box>

                    <Box sx={{display: 'flex', flexDirection: 'row', gap: 1}}>
                        <SelectFieldControlled<IBatchesForm>
                            name="leather_id"
                            label={t("production.batch.leather")}
                            options={leathers.map(x => ({label: x.name, value: x.id}))}
                            required
                        />
                        {/* Pezzi scelta */}
                    </Box>

                    <Box sx={{display: 'flex', flexDirection: 'row', gap: 1, mt: 1}}>
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
    )
}

export default BatchesForm;