import {forwardRef} from "react";
import type {IDialogActions} from "@ui/dialog/IDialogActions.ts";
import BaseDialog from "@ui/dialog/BaseDialog.tsx";
import {Typography} from "@mui/material";
import {useTranslation} from "react-i18next";
import GenericForm from "@features/panels/shared/GenericForm.tsx";
import {batchApi} from "@features/panels/production/batches/api/batchApi.ts";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {IBatchesStoreState} from "@features/panels/production/batches/BatchesPanel.tsx";
import {batchSelectionApi} from "@features/panels/production/batches/selection/api/batchSelectionApi.ts";
import {selectionApi} from "@features/panels/products/selection/api/selectionApi.ts";
import SelectFieldControlled from "@ui/form/controlled/SelectFieldController.tsx";
import NumberFieldControlled from "@ui/form/controlled/NumberFieldControlled.tsx";
import HighlightAltIcon from "@mui/icons-material/HighlightAlt";
import CustomButton from "@features/panels/shared/CustomButton.tsx";
import {thicknessApi} from "@features/panels/leathers/thicknesses/api/thicknessApi.ts";

type Props = unknown;

export type IBatchSelectionForm = {
    batch_id: number;
    selection_id: number;
    thickness_id: number;
    pieces: number;
}

const BatchesSelectionFormDialog = forwardRef<IDialogActions, Props>((_props, ref) => {
    const {t} = useTranslation(["form", "common"]);

    const {useStore} = usePanel<unknown, IBatchesStoreState>();
    const selectedBatchId = useStore((state) => state.uiState.selectedBatchId);

    const {data: batch} = batchApi.useGetDetail(selectedBatchId);
    const {mutateAsync: createBatchSelection, isPending} = batchSelectionApi.usePost({invalidateQueries: ['BATCH', 'DETAIL', String(batch?.id)]});

    const {data: selections = []} = selectionApi.useGetList();
    const {data: thicknesses = []} = thicknessApi.useGetList();

    return (
        <BaseDialog ref={ref} sx={{p: 2}}>
            <Typography variant="h5" sx={{mb: 2}}>{t("production.batch.selection")}</Typography>

            <GenericForm<IBatchSelectionForm>
                dialogMode
                dialogRef={ref}
                disabledBasicButtons
                bypassConfirm
                selectedId={selectedBatchId}
                entity={{
                    batch_id: batch?.id as number,
                    selection_id: 0,
                    thickness_id: 0,
                    pieces: 0
                }}
                emptyValues={{
                    batch_id: batch?.id as number,
                    selection_id: 0,
                    thickness_id: 0,
                    pieces: 0
                }}
                mapEntityToForm={(x) => ({
                    batch_id: x.batch_id,
                    selection_id: x.selection_id,
                    thickness_id: x.thickness_id,
                    pieces: x.pieces
                })}
                create={(payload) => createBatchSelection(payload)}
                isSaving={isPending}
                extraButtons={[
                    <CustomButton
                        label={t("common:button.execute")}
                        icon={<HighlightAltIcon/>}
                        color={"success"}
                        isSubmit
                    />
                ]}
                validateBeforeSave={(v) => v.selection_id > 0 && v.thickness_id > 0 && !!v.pieces}
                renderFields={() => (
                    <>
                        <SelectFieldControlled<IBatchSelectionForm>
                            name={"selection_id"}
                            label={t("production.batch.selection")}
                            options={selections.map((x) => ({label: x.name, value: x.id}))}
                        />
                        <SelectFieldControlled<IBatchSelectionForm>
                            name={"thickness_id"}
                            label={t("leathers.type.thickness")}
                            options={thicknesses.map((x) => ({label: x.name, value: x.id}))}
                        />
                        <NumberFieldControlled<IBatchSelectionForm>
                            name={"pieces"}
                            label={t("production.batch.selections.pieces")}
                            min={0}
                            max={batch?.batch_selections_count as number}
                            precision={0}
                        />
                    </>
                )}
            />
        </BaseDialog>
    )
})

export default BatchesSelectionFormDialog;