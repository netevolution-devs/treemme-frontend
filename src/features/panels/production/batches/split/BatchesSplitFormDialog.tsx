import {forwardRef} from "react";
import type {IDialogActions} from "@ui/dialog/IDialogActions";
import BaseDialog from "@ui/dialog/BaseDialog";
import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext";
import type {IBatchesStoreState} from "@features/panels/production/batches/BatchesPanel";
import {batchApi} from "@features/panels/production/batches/api/batchApi";
import useBatchSplit from "@features/panels/production/batches/split/api/useBatchSplit";
import {Stack, Typography} from "@mui/material";
import GenericForm from "@features/panels/shared/GenericForm";
import CallSplitIcon from "@mui/icons-material/CallSplit";
import CustomButton from "@features/panels/shared/CustomButton";
import NumberFieldControlled from "@ui/form/controlled/NumberFieldControlled";
import DateFieldControlled from "@ui/form/controlled/DateFieldControlled";
import dayjs from "dayjs";
import SelectFieldControlled from "@ui/form/controlled/SelectFieldController";
import type {ILeatherForm} from "@features/panels/leathers/leathers/LeathersForm";
import useSubscribePanel from "@ui/panel/useSubscribePanel";
import useCallablePanel from "@ui/panel/useCallablePanel";
import {thicknessApi} from "@features/panels/leathers/thicknesses/api/thicknessApi";

type Props = unknown;

export type ISplitForm = {
    pieces: number;
    thickness_id: number | null;
    date: string;
}

const BatchesSplitFormDialog = forwardRef<IDialogActions, Props>((_props, ref) => {
    const {t} = useTranslation(["form", "common"]);

    const {useStore} = usePanel<unknown, IBatchesStoreState>();
    const selectedBatchId = useStore((state) => state.uiState.selectedBatchId);

    const {data: batch} = batchApi.useGetDetail(selectedBatchId);

    const {mutateAsync: splitBatch, isPending} = useBatchSplit(batch?.id as number, batch?.batch_code as string);

    return (
        <BaseDialog ref={ref} sx={{p: 2}}>
            <Typography variant="h5" sx={{mb: 2}}>{t("production.batch.split")}</Typography>

            <GenericForm<ISplitForm>
                resource="produzione - lotti"
                dialogMode
                dialogRef={ref}
                disabledBasicButtons
                bypassConfirm
                selectedId={null}
                entity={{
                    pieces: 0,
                    thickness_id: null,
                    date: dayjs().format("YYYY-MM-DD"),
                }}
                emptyValues={{
                    pieces: 0,
                    thickness_id: null,
                    date: dayjs().format("YYYY-MM-DD"),
                }}
                mapEntityToForm={(x) => ({
                    pieces: x.pieces,
                    date: x.date,
                    thickness_id: x.thickness_id,
                })}
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
                    <BatchesSplitFormDialogFields selectedBatchId={selectedBatchId as number}/>
                )}
            />
        </BaseDialog>
    )
})

interface BatchesSplitFormDialogFieldsProps {
    selectedBatchId: number;
}

const BatchesSplitFormDialogFields = ({selectedBatchId}: BatchesSplitFormDialogFieldsProps) => {
    const {t} = useTranslation(["form", "common"]);

    const {data: batch} = batchApi.useGetDetail(selectedBatchId);
    const {data: thicknesses = []} = thicknessApi.useGetList();

    const {add: addSelectPanel} = useCallablePanel();
    useSubscribePanel<ISplitForm>({
        formKey: "thickness_id",
        dependencyKey: "thicknesses"
    });

    return (
        <Stack gap={1.5}>
            <DateFieldControlled<ISplitForm>
                name={"date"}
                label={t("production.date")}
            />
            <SelectFieldControlled<ILeatherForm>
                name={"thickness_id"}
                label={t("leathers.leather.thickness")}
                options={thicknesses.map((x) => ({
                    label: `${x.name}`,
                    value: x.id
                }))}
                required
                onNoOptionsMatch={(input) => {
                    addSelectPanel({
                        initialValue: input,
                        menu: {
                            component: "thicknesses",
                            i18nKey: "menu.leathers.thicknesses",
                        }
                    })
                }}
            />
            <NumberFieldControlled<ISplitForm>
                name={"pieces"}
                label={t("production.batch.pieces")}
                max={batch?.stock_items as number}
                precision={0}
            />
        </Stack>
    )
}

export default BatchesSplitFormDialog;