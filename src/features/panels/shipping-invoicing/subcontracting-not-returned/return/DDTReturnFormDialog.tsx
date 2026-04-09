import {forwardRef} from "react";
import type {IDialogActions} from "@ui/dialog/IDialogActions";
import BaseDialog from "@ui/dialog/BaseDialog";
import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext";
import {Box, Stack, Typography} from "@mui/material";
import GenericForm from "@features/panels/shared/GenericForm";
import CustomButton from "@features/panels/shared/CustomButton";
import DateFieldControlled from "@ui/form/controlled/DateFieldControlled";
import NumberFieldControlled from "@ui/form/controlled/NumberFieldControlled";
import dayjs from "dayjs";
import type {
    ISubcontractingNotReturnedStoreState
} from "@features/panels/shipping-invoicing/subcontracting-not-returned/SubcontractingNotReturnedPanel";
import usePostSubcontractingReturn
    from "@features/panels/shipping-invoicing/subcontracting-not-returned/return/api/usePostSubcontractingReturn";
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import useGetDDTNotReturned
    from "@features/panels/shipping-invoicing/subcontracting-not-returned/api/useGetDDTNotReturned";
import TextFieldControlled from "@ui/form/controlled/TextFieldControlled";

type Props = unknown;

export type IDDTReturnForm = {
    date: string;
    pieces: number | null;
    note: string;
}

const DDTReturnFormDialog = forwardRef<IDialogActions, Props>((_props, ref) => {
    const {t} = useTranslation(["form", "common"]);

    const {useStore} = usePanel<unknown, ISubcontractingNotReturnedStoreState>();
    const selectedId = useStore((state) => state.uiState.selectedSubcontractingNotReturnedId);

    const {data: ddtRowsNotReturned = []} = useGetDDTNotReturned();
    const selectedRow = ddtRowsNotReturned.find(x => x.id === selectedId);

    const {mutateAsync: returnSubcontract, isPending} = usePostSubcontractingReturn(selectedRow?.batch.id as number);

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
                    pieces: null,
                    note: ""
                }}
                emptyValues={{
                    date: dayjs().format("YYYY-MM-DD"),
                    pieces: null,
                    note: ""
                }}
                mapEntityToForm={(x) => ({date: x.date, pieces: x.pieces, note: x.note})}
                create={(payload) => returnSubcontract({
                    ddtRowId: selectedId as number,
                    date: payload.date,
                    pieces: payload.pieces as number,
                    note: payload.note
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
                    <Stack gap={0.7}>
                        <Box sx={{mb: 1}}>
                            <DateFieldControlled<IDDTReturnForm>
                                name={"date"}
                                label={t("production.date")}
                                required
                            />
                        </Box>
                        <NumberFieldControlled<IDDTReturnForm>
                            name={"pieces"}
                            label={t("production.batch.pieces")}
                            max={selectedRow?.stock_pieces as number || 0}
                            precision={0}
                            required
                        />
                        <TextFieldControlled<IDDTReturnForm>
                            name="note"
                            label={t("contacts.notes")}
                            TextFieldProps={{multiline: true, rows: 2}}
                        />
                    </Stack>
                )}
            />
        </BaseDialog>
    )
})

export default DDTReturnFormDialog;