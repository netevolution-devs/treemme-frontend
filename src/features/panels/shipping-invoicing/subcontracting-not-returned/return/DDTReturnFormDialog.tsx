import {forwardRef} from "react";
import type {IDialogActions} from "@ui/dialog/IDialogActions.ts";
import BaseDialog from "@ui/dialog/BaseDialog.tsx";
import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import {Stack, Typography} from "@mui/material";
import GenericForm from "@features/panels/shared/GenericForm.tsx";
import CustomButton from "@features/panels/shared/CustomButton.tsx";
import DateFieldControlled from "@ui/form/controlled/DateFieldControlled.tsx";
import NumberFieldControlled from "@ui/form/controlled/NumberFieldControlled.tsx";
import dayjs from "dayjs";
import type {ISubcontractingNotReturnedStoreState} from "@features/panels/shipping-invoicing/subcontracting-not-returned/SubcontractingNotReturnedPanel.tsx";
import usePostSubcontractingReturn from "@features/panels/shipping-invoicing/subcontracting-not-returned/return/api/usePostSubcontractingReturn.ts";
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import useGetDDTNotReturned from "@features/panels/shipping-invoicing/subcontracting-not-returned/api/useGetDDTNotReturned.ts";

type Props = unknown;

export type IDDTReturnForm = {
    date: string;
    pieces: number;
}

const DDTReturnFormDialog = forwardRef<IDialogActions, Props>((_props, ref) => {
    const {t} = useTranslation(["form", "common"]);

    const {useStore} = usePanel<unknown, ISubcontractingNotReturnedStoreState>();
    const selectedId = useStore((state) => state.uiState.selectedSubcontractingNotReturnedId);

    const {data: ddtRowsNotReturned = []} = useGetDDTNotReturned();
    const selectedRow = ddtRowsNotReturned.find(x => x.id === selectedId);

    const {mutateAsync: returnSubcontract, isPending} = usePostSubcontractingReturn();

    return (
        <BaseDialog ref={ref} sx={{p: 2}}>
            <Typography variant="h5" sx={{mb: 2}}>{t("shipping.ddt_rows.return")}</Typography>

            <GenericForm<IDDTReturnForm>
                dialogMode
                dialogRef={ref}
                disabledBasicButtons
                bypassConfirm
                selectedId={selectedId}
                entity={{
                    date: dayjs().format("YYYY-MM-DD"),
                    pieces: 0,
                }}
                emptyValues={{
                    date: dayjs().format("YYYY-MM-DD"),
                    pieces: 0,
                }}
                mapEntityToForm={(x) => ({date: x.date, pieces: x.pieces})}
                create={(payload) => returnSubcontract({
                    ddtRowId: selectedId as number,
                    date: payload.date,
                    pieces: payload.pieces
                })}
                extraButtons={[
                    <CustomButton
                        label={t("common:button.execute")}
                        color={"primary"}
                        icon={<AssignmentReturnIcon/>}
                        isSubmit
                    />
                ]}
                isSaving={isPending}
                renderFields={() => (
                    <Stack gap={1.5}>
                        <DateFieldControlled<IDDTReturnForm>
                            name={"date"}
                            label={t("production.date")}
                            required
                        />
                        <NumberFieldControlled<IDDTReturnForm>
                            name={"pieces"}
                            label={t("production.batch.pieces")}
                            max={selectedRow?.pieces as number || 0}
                            precision={0}
                            required
                        />
                    </Stack>
                )}
            />
        </BaseDialog>
    )
})

export default DDTReturnFormDialog;