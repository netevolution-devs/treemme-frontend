import {forwardRef} from "react";
import type {IDialogActions} from "@ui/dialog/IDialogActions";
import BaseDialog from "@ui/dialog/BaseDialog";
import {Typography} from "@mui/material";
import {useTranslation} from "react-i18next";
import GenericForm from "@features/panels/shared/GenericForm";
import {batchApi} from "@features/panels/production/batches/api/batchApi";
import {usePanel} from "@ui/panel/PanelContext";
import type {IBatchesStoreState} from "@features/panels/production/batches/BatchesPanel";
import {batchSelectionApi} from "@features/panels/production/batches/selection/api/batchSelectionApi";
import {selectionApi} from "@features/panels/products/selection/api/selectionApi";
import SelectFieldControlled from "@ui/form/controlled/SelectFieldController";
import NumberFieldControlled from "@ui/form/controlled/NumberFieldControlled";
import HighlightAltIcon from "@mui/icons-material/HighlightAlt";
import CustomButton from "@features/panels/shared/CustomButton";
import {thicknessApi} from "@features/panels/leathers/thicknesses/api/thicknessApi";
import TextFieldControlled from "@ui/form/controlled/TextFieldControlled";

type Props = unknown;

export type IBatchSelectionForm = {
    batch_id: number | null;
    selection_id: number | null;
    thickness_id: number | null;
    pieces: number | null;
    note: string | null;
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
                resource="produzione - lotti"
                dialogMode
                dialogRef={ref}
                disabledBasicButtons
                bypassConfirm
                selectedId={null}
                entity={{
                    batch_id: batch?.id as number,
                    selection_id: null,
                    thickness_id: null,
                    pieces: null,
                    note: null
                }}
                emptyValues={{
                    batch_id: batch?.id as number,
                    selection_id: null,
                    thickness_id: null,
                    pieces: null,
                    note: null
                }}
                mapEntityToForm={(x) => ({
                    batch_id: x.batch_id,
                    selection_id: x.selection_id,
                    thickness_id: x.thickness_id,
                    pieces: x.pieces,
                    note: x.note
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
                validateBeforeSave={(v) => !!v.selection_id && !!v.thickness_id && !!v.pieces}
                renderFields={() => (
                    <>
                        <SelectFieldControlled<IBatchSelectionForm>
                            name={"selection_id"}
                            label={t("production.batch.selection")}
                            options={selections.map((x) => ({label: x.name, value: x.id}))}
                            required
                        />
                        <SelectFieldControlled<IBatchSelectionForm>
                            name={"thickness_id"}
                            label={t("leathers.type.thickness")}
                            options={thicknesses.map((x) => ({label: x.name, value: x.id}))}
                            required
                        />
                        <NumberFieldControlled<IBatchSelectionForm>
                            name={"pieces"}
                            label={t("production.batch.selections.pieces")}
                            min={0}
                            max={batch?.batch_selections_count as number}
                            precision={0}
                            required
                        />
                        <TextFieldControlled<IBatchSelectionForm>
                            name={"note"}
                            label={t("production.batch.selections.note")}
                            TextFieldProps={{multiline: true, rows: 2}}
                        />
                    </>
                )}
            />
        </BaseDialog>
    )
})

export default BatchesSelectionFormDialog;