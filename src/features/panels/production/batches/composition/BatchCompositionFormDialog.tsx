import {forwardRef} from "react";
import type {IDialogActions} from "@ui/dialog/IDialogActions";
import BaseDialog from "@ui/dialog/BaseDialog";
import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext";
import type {IBatchesStoreState} from "@features/panels/production/batches/BatchesPanel";
import usePostBatchComposition from "@features/panels/production/batches/composition/api/usePostBatchComposition";
import useGetBatchSplitAvailability from "@features/panels/production/batches/composition/api/useGetBatchSplitAvailability";
import GenericForm from "@features/panels/shared/GenericForm";
import NumberFieldControlled from "@ui/form/controlled/NumberFieldControlled";
import SelectFieldControlled from "@ui/form/controlled/SelectFieldController";
import {Box, Typography} from "@mui/material";
import TextFieldControlled from "@ui/form/controlled/TextFieldControlled";
import {useWatch} from "react-hook-form";
import dayjs from "dayjs";
import DateFieldControlled from "@ui/form/controlled/DateFieldControlled";
import CustomButton from "@features/panels/shared/CustomButton";
import AddToPhotosIcon from "@mui/icons-material/AddToPhotos";

export interface IBatchCompositionForm {
    father_batch_piece: number | null;
    // quantity: number;
    father_batch_id: number | null;
    batch_selection_id: number | null;
    composition_note?: string;
    date?: string;
}

const BatchCompositionFormDialog = forwardRef<IDialogActions>((_, ref) => {
    const {t} = useTranslation(["form", "common"]);

    const {useStore} = usePanel<unknown, IBatchesStoreState>();
    const selectedBatchId = useStore(state => state.uiState.selectedBatchId);

    const {mutateAsync: createComposition, isPending} = usePostBatchComposition(selectedBatchId as number);

    return (
        <BaseDialog ref={ref} sx={{p: 2}}>
            <Typography variant="h5" sx={{mb: 2}}>{t("composition.title")}</Typography>

            <GenericForm<IBatchCompositionForm, unknown, IBatchesStoreState>
                resource="produzione - lotti"
                selectedId={null}
                dialogMode
                dialogRef={ref}
                disabledBasicButtons
                bypassConfirm
                emptyValues={{
                    father_batch_piece: null,
                    // quantity: 0,
                    father_batch_id: null,
                    batch_selection_id: null,
                    composition_note: '',
                    date: dayjs().format('YYYY-MM-DD')
                }}
                mapEntityToForm={() => ({
                    father_batch_piece: null,
                    // quantity: 0,
                    batch_selection_id: null,
                    father_batch_id: null,
                    composition_note: '',
                    date: dayjs().format('YYYY-MM-DD')
                })}
                create={(data) => createComposition({
                    batch_selection_id: data.batch_selection_id as number,
                    date: data.date as string,
                    composition_note: data.composition_note as string,
                    father_batch_piece: data.father_batch_piece as number
                })}
                isSaving={isPending}
                validateBeforeSave={(v) =>
                    !!v.father_batch_piece &&
                    // v.quantity > 0 &&
                    !!v.batch_selection_id
                }
                extraButtons={[
                    <CustomButton
                        label={t("common:button.execute")}
                        color={"primary"}
                        icon={<AddToPhotosIcon/>}
                        isSubmit
                    />
                ]}
                renderFields={() => (
                    <BatchCompositionFormFields/>
                )}
            />
        </BaseDialog>
    );
});

const BatchCompositionFormFields = () => {
    const {t} = useTranslation(["form"]);

    const {data: batches = []} = useGetBatchSplitAvailability();

    const watchedFatherBatchId = useWatch<IBatchCompositionForm>({name: "father_batch_id"});
    const watchedSelectionId = useWatch<IBatchCompositionForm>({name: "batch_selection_id"});
    const batchSelections = batches.find(b => b.id === watchedFatherBatchId)?.batch_selections || [];

    return (
        <Box sx={{mb: 1}}>
            <Box sx={{mb: 1.2}}>
                <DateFieldControlled<IBatchCompositionForm>
                    name={"date"}
                    label={t("production.date")}
                />
            </Box>
            <SelectFieldControlled<IBatchCompositionForm>
                name="father_batch_id"
                label={t("production.batch.father_batch")}
                options={batches.map(b => ({
                    value: b.id,
                    label: `${b.batch_code} - ${b.leather?.name || b.article?.name || ''}`
                }))}
                required
            />
            <SelectFieldControlled<IBatchCompositionForm>
                name="batch_selection_id"
                label={t("production.batch.father_batch_selection")}
                options={batchSelections.map((b) => ({
                    value: b.id,
                    label: `${b.selection?.name || ''} - ${b.thickness?.name || ''} - ${b.stock_pieces} ${t("production.batch.pieces-string")}`
                }))}
                required
                deactivated={!watchedFatherBatchId}
            />
            <NumberFieldControlled<IBatchCompositionForm>
                name="father_batch_piece"
                label={t("production.batch.pieces")}
                required
                precision={0}
                max={batchSelections.find(b => b.id === watchedSelectionId)?.stock_pieces as number || 0}
                deactivated={!watchedSelectionId}
            />
            {/*<NumberFieldControlled<IBatchCompositionForm>*/}
            {/*    name="quantity"*/}
            {/*    label={t("production.batch.quantity")}*/}
            {/*    required*/}
            {/*/>*/}
            <TextFieldControlled<IBatchCompositionForm>
                name="composition_note"
                label={t("production.batch.note")}
                TextFieldProps={{multiline: true, rows: 2}}
            />
        </Box>
    )
}

export default BatchCompositionFormDialog;