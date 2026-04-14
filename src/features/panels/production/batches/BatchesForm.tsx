import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext";
import type {
    IBatchesStoreFilter,
    IBatchesStoreState
} from "@features/panels/production/batches/BatchesPanel";
import {batchApi, type IBatchesPayload} from "@features/panels/production/batches/api/batchApi";
import {batchTypeApi} from "@features/panels/production/batches/api/batch-type/batchTypeApi";
import GenericForm from "@features/panels/shared/GenericForm";
import type {IBatch} from "@features/panels/production/batches/api/IBatch";
import {leatherApi} from "@features/panels/leathers/leathers/api/leatherApi";
import {measurementUnitApi} from "@features/panels/shared/api/measurement-unit/measurementUnitApi";
import TextFieldControlled from "@ui/form/controlled/TextFieldControlled";
import SelectFieldControlled from "@ui/form/controlled/SelectFieldController";
import FlagCheckBoxFieldControlled from "@ui/form/controlled/FlagCheckBoxFieldControlled";
import TextFieldValue from "@ui/form/controlled/TextFieldValue";
import DateFieldControlled from "@ui/form/controlled/DateFieldControlled";
import {Box} from "@mui/material";
import NumberFieldControlled from "@ui/form/controlled/NumberFieldControlled";
import CustomButton from "@features/panels/shared/CustomButton";
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import {openDialog} from "@ui/dialog/dialogHelper";
import type {IDialogActions} from "@ui/dialog/IDialogActions";
import {useRef} from "react";
import BatchesReworkFormDialog from "@features/panels/production/batches/rework/BatchesReworkFormDialog";
import BatchesSplitFormDialog from "@features/panels/production/batches/split/BatchesSplitFormDialog";
import CallSplitIcon from '@mui/icons-material/CallSplit';
import dayjs from "dayjs";
import {TMLeatherIcon} from "@ui/layout/menu/MenuIcons";
import useCallablePanel from "@ui/panel/useCallablePanel";
import {PrintRounded} from "@mui/icons-material";

export type IBatchesForm = Omit<IBatch, 'id'
    | 'leather'
    | 'article'
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
    | 'productions'
    | 'batch_compositions'
    | 'quantity'
    | 'pieces'
> & {
    leather_id: number | null;
    batch_type_id: number | null;
    measurement_unit_id: number | null;
    quantity: number | null
    pieces: number | null;
};

const BatchesForm = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<IBatchesStoreFilter, IBatchesStoreState>();
    const isEditMode = useStore((state) => state.uiState.buttonsState.edit);
    const isSaveMode = useStore((state) => state.uiState.buttonsState.save);
    const selectedBatchId = useStore((state) => state.uiState.selectedBatchId);
    const setUIState = useStore((state) => state.setUIState);

    const {useGetDetail, usePost, usePut, useDelete, useGetPdf} = batchApi;
    const {data: batchItem} = useGetDetail(selectedBatchId);
    const getBatchPdf = useGetPdf();
    const {mutateAsync: createBatch, isPending: isPosting} = usePost();
    const {mutateAsync: updateBatch, isPending: isPutting} = usePut();
    const {mutateAsync: deleteBatch, isPending: isDeleting} = useDelete();

    const {useGetList: useGetBatchTypes} = batchTypeApi;
    const {data: batchTypes = []} = useGetBatchTypes();

    const {useGetList: useGetMeasurementUnits} = measurementUnitApi;
    const {data: measurementUnits = []} = useGetMeasurementUnits();

    const reworkDialogRef = useRef<IDialogActions | null>(null);
    const splitDialogRef = useRef<IDialogActions | null>(null);

    return (
        <>
            <BatchesReworkFormDialog ref={reworkDialogRef}/>
            <BatchesSplitFormDialog ref={splitDialogRef}/>

            <GenericForm<IBatchesForm, IBatch, IBatchesStoreState>
                resource="produzione - lotti"
                selectedId={selectedBatchId}
                entity={batchItem}
                emptyValues={{
                    leather_id: null,
                    batch_type_id: batchTypes.find(x => x.name === "Lotto")?.id || null,
                    measurement_unit_id: measurementUnits.find(x => x.name === "Piedi quadrati")?.id || null,
                    completed: false,
                    checked: false,
                    batch_date: dayjs(Date.now()).format('YYYY-MM-DD'),
                    quantity: null,
                    selection_note: '',
                    batch_note: '',
                    sampling: false,
                    split_selected: false,
                    check_date: '',
                    check_note: '',
                    pieces: null,
                }}
                mapEntityToForm={(x) => ({
                    leather_id: x.leather?.id || null,
                    batch_type_id: x.batch_type?.id || null,
                    measurement_unit_id: x.measurement_unit?.id || null,
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
                onCreateSuccess={(id) => {
                    setUIState({selectedBatchId: id})
                }}
                update={(id, payload) => updateBatch({id, payload: payload as IBatchesPayload})}
                remove={(id) => deleteBatch(id)}
                isSaving={isPosting || isPutting}
                isDeleting={isDeleting}
                onClearSelection={() => setUIState({selectedBatchId: null})}
                validateBeforeSave={(v) =>
                    (!!v.leather_id || !!batchItem?.article) &&
                    !!v.batch_type_id &&
                    !!v.pieces &&
                    !!v.batch_date
                }
                extraButtons={[
                    <CustomButton
                        label={t("production.batch.rework")}
                        color={"success"}
                        icon={<SettingsBackupRestoreIcon/>}
                        isEnable={!!selectedBatchId && batchItem?.batch_type.name === "Lotto" && batchItem.stock_items > 0}
                        onClick={() => {
                            openDialog(reworkDialogRef)
                        }}
                    />,
                    <CustomButton
                        label={t("production.batch.split")}
                        color={"primary"}
                        icon={<CallSplitIcon/>}
                        isEnable={!!selectedBatchId && batchItem?.batch_type.name === "Lotto" || batchItem?.batch_type.name === "Rinverdimento"}
                        onClick={() => openDialog(splitDialogRef)}
                    />,
                    <CustomButton
                        label={""}
                        minWidth={0}
                        color={"primary"}
                        icon={<PrintRounded fontSize={"small"}/>}
                        isEnable={!!selectedBatchId && (batchItem?.batch_type.name === "Lotto" || batchItem?.batch_type.name === "Tintura")}
                        onClick={() => selectedBatchId && getBatchPdf(selectedBatchId, batchItem?.batch_code ?? "")}
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
                                required
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
                                disabled
                            />
                            <FlagCheckBoxFieldControlled<IBatchesForm>
                                name="completed"
                                label={t("production.batch.completed")}
                                width={120}
                                disabled
                            />
                        </Box>

                        <Box sx={{display: 'flex', flexDirection: 'row', gap: 1}}>
                            <SelectFieldControlled<IBatchesForm>
                                name="batch_type_id"
                                label={t("production.batch.batch_type")}
                                options={batchTypes.map(x => ({label: x.name, value: x.id}))}
                                deactivated={!!selectedBatchId}
                                required
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
                                required
                            />
                            <NumberFieldControlled<IBatchesForm>
                                name="quantity"
                                label={t("production.batch.quantity")}
                                precision={2}
                                step={1}
                                required
                            />
                            <SelectFieldControlled<IBatchesForm>
                                name="measurement_unit_id"
                                label={t("production.batch.measurement_unit")}
                                options={measurementUnits.map(x => ({label: x.name, value: x.id}))}
                                required
                            />
                            {selectedBatchId && (
                                <TextFieldValue
                                    label={t("production.batch.stock_items")}
                                    value={batchItem?.stock_items}
                                    isFilled={!!selectedBatchId}
                                />
                            )}
                            {/*<TextFieldValue*/}
                            {/*    label={t("production.batch.stock_quantity")}*/}
                            {/*    value={batchItem?.stock_quantity}*/}
                            {/*    isFilled={!!selectedBatchId}*/}
                            {/*    precision={2}*/}
                            {/*/>*/}
                        </Box>

                        {(!batchItem || batchItem.leather) && (
                            <Box sx={{display: 'flex', flexDirection: 'row', gap: 1}}>
                                <BatchesSelectLeather
                                    isEdit={isEditMode || isSaveMode}
                                    batchItem={batchItem}
                                />
                            </Box>
                        )}
                        {batchItem?.article && (
                            <Box sx={{display: 'flex', flexDirection: 'row', gap: 1, mb: 0.8}}>
                                <TextFieldValue
                                    label={t("production.batch.article")}
                                    value={batchItem.article.name}
                                    isFilled={true}
                                />
                            </Box>
                        )}

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
                            <TextFieldControlled<IBatchesForm>
                                name="selection_note"
                                label={t("production.batch.selection_note")}
                                TextFieldProps={{multiline: true, rows: 2}}
                            />
                        </Box>

                        {/*<Box sx={{mt: 2}}>*/}
                        {/*    <Typography variant="subtitle2" sx={{mb: 1}}>{t("production.batch.notes_section")}</Typography>*/}
                        {/*
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

interface IBatchSelectLeatherProps {
    isEdit?: boolean;
    batchItem: IBatch | undefined;
}

const BatchesSelectLeather = ({batchItem, isEdit = false}: IBatchSelectLeatherProps) => {
    const {t} = useTranslation(["form"]);

    const {data: leathers = []} = leatherApi.useGetList();

    const {add: addSelectPanel} = useCallablePanel();

    return (
        <>
            <SelectFieldControlled<IBatchesForm>
                name="leather_id"
                label={t("production.batch.leather")}
                options={leathers.map(x => ({label: x.name, value: x.id}))}
                deactivated={!!batchItem}
                required
            />
            <Box sx={{mb: 1}}>
                <CustomButton
                    isEnable={isEdit}
                    minWidth={30}
                    label={(t("production.batch.leather"))}
                    color={"primary"}
                    icon={<TMLeatherIcon/>}
                    onClick={() => {
                        addSelectPanel({
                            initialValue: "",
                            menu: {
                                component: "leathers",
                                i18nKey: "menu.leathers.leathers"
                            },
                            extra: {
                                leatherId: batchItem?.leather?.id || null,
                            }
                        })
                    }}
                />
            </Box>
        </>
    )
}

export default BatchesForm;