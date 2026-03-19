import {forwardRef, useMemo} from "react";
import type {IDialogActions} from "@ui/dialog/IDialogActions.ts";
import BaseDialog from "@ui/dialog/BaseDialog.tsx";
import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {IBatchesStoreState} from "@features/panels/production/batches/BatchesPanel.tsx";
import usePostBatchComposition from "@features/panels/production/batches/composition/api/usePostBatchComposition.ts";
import useGetBatchAvailability from "@features/panels/production/batches/composition/api/useGetBatchAvailability.ts";
import GenericForm from "@features/panels/shared/GenericForm.tsx";
import NumberFieldControlled from "@ui/form/controlled/NumberFieldControlled.tsx";
import SelectFieldControlled from "@ui/form/controlled/SelectFieldController.tsx";
import {Box} from "@mui/material";
import TextFieldControlled from "@ui/form/controlled/TextFieldControlled.tsx";

export interface IBatchCompositionForm {
    pieces: number | null;
    // quantity: number;
    father_batch_id: number | null;
    note?: string;
}

const BatchCompositionFormDialog = forwardRef<IDialogActions>((_, ref) => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IBatchesStoreState>();
    const selectedBatchId = useStore(state => state.uiState.selectedBatchId);

    const {data: batches = []} = useGetBatchAvailability();
    const batchOptions = useMemo(() =>
        batches
            .map(b => ({
                value: b.id,
                label: `${b.batch_code} - ${b.leather?.name || b.article?.name || ''}`
            })),
    [batches, selectedBatchId]);

    const {mutateAsync: createComposition, isPending} = usePostBatchComposition(selectedBatchId as number);

    return (
        <BaseDialog ref={ref} sx={{p: 2}}>
            <GenericForm<IBatchCompositionForm, unknown, IBatchesStoreState>
                selectedId={null}
                dialogMode
                dialogRef={ref}
                bypassConfirm
                emptyValues={{
                    pieces: null,
                    // quantity: 0,
                    father_batch_id: null,
                    note: ''
                }}
                mapEntityToForm={() => ({
                    pieces: 0,
                    // quantity: 0,
                    father_batch_id: null,
                    note: ''
                })}
                create={(data) => {
                    if (!selectedBatchId && !data.pieces) return;
                    return createComposition({
                        ...data,
                        father_batch_id: data.father_batch_id as number,
                        pieces: data.pieces as number
                    });
                }}
                isSaving={isPending}
                validateBeforeSave={(v) =>
                    !!v.pieces &&
                    // v.quantity > 0 &&
                    !!v.father_batch_id
                }
                renderFields={() => (
                    <Box sx={{mb: 1}}>
                        <SelectFieldControlled<IBatchCompositionForm>
                            name="father_batch_id"
                            label={t("production.batch.father_batch")}
                            options={batchOptions}
                            required
                        />
                        <NumberFieldControlled<IBatchCompositionForm>
                            name="pieces"
                            label={t("production.batch.pieces")}
                            required
                            precision={0}
                        />
                        {/*<NumberFieldControlled<IBatchCompositionForm>*/}
                        {/*    name="quantity"*/}
                        {/*    label={t("production.batch.quantity")}*/}
                        {/*    required*/}
                        {/*/>*/}
                        <TextFieldControlled<IBatchCompositionForm>
                            name="note"
                            label={t("production.batch.note")}
                            TextFieldProps={{multiline: true, rows: 2}}
                        />
                    </Box>
                )}
            />
        </BaseDialog>
    );
});

export default BatchCompositionFormDialog;