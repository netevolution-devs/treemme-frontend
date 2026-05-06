import {forwardRef} from "react";
import type {IDialogActions} from "@ui/dialog/IDialogActions";
import BaseDialog from "@ui/dialog/BaseDialog";
import {Typography} from "@mui/material";
import {useTranslation} from "react-i18next";
import GenericForm from "@features/panels/shared/GenericForm";
import {batchApi, type IBatchPieceCompensationPayload} from "@features/panels/production/batches/api/batchApi";
import {usePanel} from "@ui/panel/PanelContext";
import type {IBatchesStoreState} from "@features/panels/production/batches/BatchesPanel";
import SelectFieldControlled from "@ui/form/controlled/SelectFieldController";
import NumberFieldControlled from "@ui/form/controlled/NumberFieldControlled";
import CustomButton from "@features/panels/shared/CustomButton";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";

type Props = {
    batchSelectionId?: number | null;
};

const BatchesCompensationFormDialog = forwardRef<IDialogActions, Props>((props, ref) => {
    const {t} = useTranslation(["form", "common"]);

    const {useStore} = usePanel<unknown, IBatchesStoreState>();
    const selectedBatchId = useStore((state) => state.uiState.selectedBatchId);

    const {data: batch} = batchApi.useGetDetail(selectedBatchId);
    const {mutateAsync: compensateBatch, isPending} = batchApi.usePutBatchPieceCompensation({
        invalidateQueries: ['BATCH', 'DETAIL', String(batch?.id)]
    });

    const selections = batch?.batch_selections || [];

    return (
        <BaseDialog ref={ref} sx={{p: 2}}>
            <Typography variant="h5" sx={{mb: 2}}>{t("production.batch.compensation")}</Typography>

            <GenericForm<IBatchPieceCompensationPayload>
                resource="produzione - lotti"
                dialogMode
                dialogRef={ref}
                disabledBasicButtons
                bypassConfirm
                selectedId={null}
                entity={{
                    pieces: 0,
                    sign: "+",
                    batch_selection_id: props.batchSelectionId || null
                }}
                emptyValues={{
                    pieces: 0,
                    sign: "+",
                    batch_selection_id: props.batchSelectionId || null
                }}
                mapEntityToForm={(x) => ({
                    pieces: x.pieces,
                    sign: x.sign,
                    batch_selection_id: x.batch_selection_id ?? null
                })}
                create={(payload) => compensateBatch({id: batch?.id as number, payload})}
                isSaving={isPending}
                extraButtons={[
                    <CustomButton
                        label={t("common:button.execute")}
                        icon={<UnfoldMoreIcon/>}
                        color={"warning"}
                        isSubmit
                    />
                ]}
                validateBeforeSave={(v) => v.pieces > 0 && !!v.sign}
                renderFields={() => (
                    <>
                        <SelectFieldControlled<IBatchPieceCompensationPayload>
                            name={"sign"}
                            label={t("production.batch.compensation_sign")}
                            options={[
                                {label: "+", value: "+"},
                                {label: "-", value: "-"}
                            ]}
                            required
                        />
                        <NumberFieldControlled<IBatchPieceCompensationPayload>
                            name={"pieces"}
                            label={t("production.batch.selections.pieces_to_edit")}
                            min={0}
                            precision={0}
                            required
                        />
                        {!props.batchSelectionId && selections.length > 0 && (
                            <SelectFieldControlled<IBatchPieceCompensationPayload>
                                name={"batch_selection_id"}
                                label={t("production.batch.selection")}
                                options={selections.map((x) => ({
                                    label: `${x.selection.name} - ${x.thickness.name} (${x.pieces} pz)`,
                                    value: x.id
                                }))}
                            />
                        )}
                    </>
                )}
            />
        </BaseDialog>
    )
})

export default BatchesCompensationFormDialog;
