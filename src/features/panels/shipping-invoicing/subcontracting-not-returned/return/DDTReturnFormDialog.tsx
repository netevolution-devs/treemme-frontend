import {forwardRef} from "react";
import {useWatch} from "react-hook-form";
import type {IDialogActions} from "@ui/dialog/IDialogActions";
import BaseDialog from "@ui/dialog/BaseDialog";
import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext";
import {Box, Stack, Typography} from "@mui/material";
import GenericForm from "@features/panels/shared/GenericForm";
import CustomButton from "@features/panels/shared/CustomButton";
import DateFieldControlled from "@ui/form/controlled/DateFieldControlled";
import NumberFieldControlled from "@ui/form/controlled/NumberFieldControlled";
import FlagCheckBoxFieldControlled from "@ui/form/controlled/FlagCheckBoxFieldControlled";
import dayjs from "dayjs";
import type {
    ISubcontractingNotReturnedStoreState
} from "@features/panels/shipping-invoicing/subcontracting-not-returned/SubcontractingNotReturnedPanel";
import usePostSubcontractingReturn
    from "@features/panels/shipping-invoicing/subcontracting-not-returned/return/api/usePostSubcontractingReturn";
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import useGetDDTNotReturned, {
    type IDDTRowNotReturned
} from "@features/panels/shipping-invoicing/subcontracting-not-returned/api/useGetDDTNotReturned";
import TextFieldControlled from "@ui/form/controlled/TextFieldControlled";

type Props = unknown;

export type IDDTReturnForm = {
    date: string;
    pieces: number | null;
    note: string;
    subcontractor_ddt_number: string | null;
    closed: boolean;
}

const ReturnFormFields = ({selectedRow}: {selectedRow: IDDTRowNotReturned | undefined}) => {
    const {t} = useTranslation(["form", "common"]);
    const watchedPieces = useWatch<IDDTReturnForm>({name: "pieces"});
    return (
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
            {watchedPieces !== null && (watchedPieces as number) < (selectedRow?.stock_pieces ?? 0) && (
                <FlagCheckBoxFieldControlled<IDDTReturnForm>
                    name="closed"
                    label={t("shipping.ddt_rows.close_row")}
                />
            )}
            <TextFieldControlled<IDDTReturnForm>
                name="subcontractor_ddt_number"
                label={t("shipping.ddt_rows.ddt_number")}
            />
            <TextFieldControlled<IDDTReturnForm>
                name="note"
                label={t("contacts.notes")}
                TextFieldProps={{multiline: true, rows: 2}}
            />
        </Stack>
    );
};

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
                selectedId={null}
                entity={{
                    date: dayjs().format("YYYY-MM-DD"),
                    pieces: null,
                    note: "",
                    closed: false,
                    subcontractor_ddt_number: ""
                }}
                emptyValues={{
                    date: dayjs().format("YYYY-MM-DD"),
                    pieces: null,
                    note: "",
                    closed: false,
                    subcontractor_ddt_number: ""
                }}
                mapEntityToForm={(x) => ({date: x.date, pieces: x.pieces, note: x.note, closed: x.closed, subcontractor_ddt_number: x.subcontractor_ddt_number})}
                create={(payload) => returnSubcontract({
                    ddtRowId: selectedId as number,
                    date: payload.date,
                    pieces: payload.pieces as number,
                    note: payload.note,
                    closed: payload.closed,
                    subcontractor_ddt_number: payload.subcontractor_ddt_number
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
                renderFields={() => <ReturnFormFields selectedRow={selectedRow} />}
            />
        </BaseDialog>
    )
})

export default DDTReturnFormDialog;