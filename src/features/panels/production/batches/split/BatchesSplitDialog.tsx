import {forwardRef} from "react";
import type {IDialogActions} from "@ui/dialog/IDialogActions.ts";
import BaseDialog from "@ui/dialog/BaseDialog.tsx";
import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {IBatchesStoreState} from "@features/panels/production/batches/BatchesPanel.tsx";
import {batchApi} from "@features/panels/production/batches/api/batchApi.ts";
import useBatchSplit from "@features/panels/production/batches/split/api/useBatchSplit.ts";
import {Typography} from "@mui/material";
import GenericForm from "@features/panels/shared/GenericForm.tsx";
import CallSplitIcon from "@mui/icons-material/CallSplit";
import CustomButton from "@features/panels/shared/CustomButton.tsx";
import NumberFieldControlled from "@ui/form/controlled/NumberFieldControlled.tsx";

type Props = unknown;

export type ISplitForm = {
    pieces: number;
}

const BatchesSplitDialog =forwardRef<IDialogActions, Props>((_props, ref)=> {
    const {t} = useTranslation(["form", "common"]);

    const {useStore} = usePanel<unknown, IBatchesStoreState>();
    const selectedBatchId = useStore((state) => state.uiState.selectedBatchId);

    const {data: batch} = batchApi.useGetDetail(selectedBatchId);

    const {mutateAsync: splitBatch, isPending} = useBatchSplit(batch?.id as number, batch?.batch_code as string);

    return (
        <BaseDialog ref={ref} sx={{p: 2}}>
            <Typography variant="h5" sx={{mb: 2}}>{t("production.batch.split")}</Typography>

            <GenericForm<ISplitForm>
                dialogMode
                dialogRef={ref}
                disabledBasicButtons
                bypassConfirm
                selectedId={selectedBatchId}
                entity={{
                    pieces: 0,
                }}
                emptyValues={{
                    pieces: 0,
                }}
                mapEntityToForm={(x) => ({pieces: x.pieces})}
                create={(payload) => splitBatch(payload)}
                validateBeforeSave={(v) => v.pieces > 0}
                extraButtons={[
                    <CustomButton
                        label={t("common:button.execute")}
                        color={"primary"}
                        icon={<CallSplitIcon/>}
                        isSubmit
                    />
                ]}
                isSaving={isPending}
                renderFields={() => (
                    <>
                        <NumberFieldControlled<ISplitForm>
                            name={"pieces"}
                            label={t("production.batch.pieces")}
                            max={batch?.stock_items as number}
                            precision={0}
                        />
                    </>
                )}
            />
        </BaseDialog>
    )
})

export default BatchesSplitDialog;