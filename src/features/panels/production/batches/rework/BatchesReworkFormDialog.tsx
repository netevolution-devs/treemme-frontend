import {forwardRef} from "react";
import type {IDialogActions} from "@ui/dialog/IDialogActions";
import BaseDialog from "@ui/dialog/BaseDialog";
import {Stack, Typography} from "@mui/material";
import GenericForm from "@features/panels/shared/GenericForm";
import {usePanel} from "@ui/panel/PanelContext";
import type {IBatchesStoreState} from "@features/panels/production/batches/BatchesPanel";
import {useTranslation} from "react-i18next";
import useBatchRework from "@features/panels/production/batches/rework/api/useBatchRework";
import {batchApi} from "@features/panels/production/batches/api/batchApi";
import CustomButton from "@features/panels/shared/CustomButton";
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import NumberFieldControlled from "@ui/form/controlled/NumberFieldControlled";
import dayjs from "dayjs";
import DateFieldControlled from "@ui/form/controlled/DateFieldControlled";

type Props = unknown;

export type IReworkForm = {
    pieces: number;
    date: string;
}

const BatchesReworkFormDialog = forwardRef<IDialogActions, Props>((_props, ref) => {
    const {t} = useTranslation(["form", "common"]);

    const {useStore} = usePanel<unknown, IBatchesStoreState>();
    const selectedBatchId = useStore((state) => state.uiState.selectedBatchId);

    const {data: batch} = batchApi.useGetDetail(selectedBatchId);

    const {mutateAsync: reworkBatch, isPending} = useBatchRework(batch?.id as number, batch?.batch_code as string);

    return (
        <BaseDialog ref={ref} sx={{p: 2}}>
            <Typography variant={"h5"} sx={{mb: 2}}>{t("production.batch.rework")}</Typography>

            <GenericForm<IReworkForm>
                resource="produzione - lotti"
                dialogMode
                dialogRef={ref}
                disabledBasicButtons
                bypassConfirm
                selectedId={null}
                entity={{
                    pieces: 0,
                    date: dayjs().format('YYYY-MM-DD')
                }}
                emptyValues={{
                    pieces: 0,
                    date: dayjs().format('YYYY-MM-DD')
                }}
                mapEntityToForm={(x) => ({pieces: x.pieces, date: x.date})}
                create={(payload) => reworkBatch(payload)}
                validateBeforeSave={(v) => v.pieces > 0}
                extraButtons={[
                    <CustomButton
                        label={t("common:button.execute")}
                        color={"success"}
                        icon={<SettingsBackupRestoreIcon/>}
                        isSubmit
                    />
                ]}
                isSaving={isPending}
                renderFields={() => (
                    <Stack gap={1.5}>
                        <DateFieldControlled<IReworkForm>
                            name={"date"}
                            label={t("production.date")}
                        />
                        <NumberFieldControlled<IReworkForm>
                            name={"pieces"}
                            label={t("production.batch.pieces")}
                            max={batch?.stock_items as number}
                            precision={0}
                        />
                    </Stack>
                )}
            />

        </BaseDialog>
    )
})

export default BatchesReworkFormDialog;