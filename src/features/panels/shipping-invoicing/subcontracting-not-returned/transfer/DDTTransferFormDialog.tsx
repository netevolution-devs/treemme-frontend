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
import type {ISubcontractingNotReturnedStoreState} from "@features/panels/shipping-invoicing/subcontracting-not-returned/SubcontractingNotReturnedPanel";
import usePostSubcontractingTransfer from "@features/panels/shipping-invoicing/subcontracting-not-returned/transfer/api/usePostSubcontractingTransfer";
import MoveDownIcon from '@mui/icons-material/MoveDown';
import useGetDDTNotReturned, {
    type IDDTRowNotReturned
} from "@features/panels/shipping-invoicing/subcontracting-not-returned/api/useGetDDTNotReturned";
import {contactsApi} from "@features/panels/contacts/contacts/api/contactsApi";
import SelectFieldControlled from "@ui/form/controlled/SelectFieldController";
import MultiSelectFieldControlled from "@shared/ui/form/controlled/MultiSelectFieldControlled";
import TextFieldControlled from "@ui/form/controlled/TextFieldControlled";
import {workingApi} from "@features/panels/production/workings/api/workingApi";

type Props = unknown;

export type IDDTTransferForm = {
    subcontractor_id: number;
    date: string;
    pieces: number | null;
    note: string;
    ddt_number: string;
    processing_ids: string | null;
    closed: boolean;
}

const TransferFormFields = ({selectedRow}: {selectedRow: IDDTRowNotReturned | undefined}) => {
    const {t} = useTranslation(["form", "common"]);
    const {data: processes = []} = workingApi.useGetList();
    const {data: contacts = []} = contactsApi.useGetList();
    const subcontractors = contacts.filter(c => c.subcontractor);
    const watchedPieces = useWatch<IDDTTransferForm>({name: "pieces"});
    return (
        <Stack gap={1}>
            <TextFieldControlled<IDDTTransferForm>
                name={"ddt_number"}
                label={t("shipping.ddt_number")}
                required
            />
            <SelectFieldControlled<IDDTTransferForm>
                name={"subcontractor_id"}
                label={t("shipping.subcontractor")}
                options={subcontractors.map(s => ({value: s.id, label: s.name}))}
                required
            />
            <MultiSelectFieldControlled<IDDTTransferForm>
                name={"processing_ids"}
                label={t("production.batch.workings")}
                options={processes.map(s => ({value: s.id, label: s.name}))}
                required
            />
            <Box sx={{mb: 1}}>
                <DateFieldControlled<IDDTTransferForm>
                    name={"date"}
                    label={t("production.date")}
                    required
                />
            </Box>
            <NumberFieldControlled<IDDTTransferForm>
                name={"pieces"}
                label={t("production.batch.pieces")}
                max={selectedRow?.pieces as number || 0}
                precision={0}
                required
            />
            {watchedPieces !== null && (watchedPieces as number) < (selectedRow?.pieces ?? 0) && (
                <FlagCheckBoxFieldControlled<IDDTTransferForm>
                    name="closed"
                    label={t("shipping.ddt_rows.close_row")}
                />
            )}
            <TextFieldControlled<IDDTTransferForm>
                name="note"
                label={t("contacts.notes")}
                TextFieldProps={{multiline: true, rows: 2}}
            />
        </Stack>
    );
};

const DDTTransferFormDialog = forwardRef<IDialogActions, Props>((_props, ref) => {
    const {t} = useTranslation(["form", "common"]);

    const {useStore} = usePanel<unknown, ISubcontractingNotReturnedStoreState>();
    const selectedId = useStore((state) => state.uiState.selectedSubcontractingNotReturnedId);

    const {data: ddtRowsNotReturned = []} = useGetDDTNotReturned();
    const selectedRow = ddtRowsNotReturned.find(x => x.id === selectedId);

    const {mutateAsync: transferSubcontract, isPending} = usePostSubcontractingTransfer();

    return (
        <BaseDialog ref={ref} sx={{p: 2}}>
            <Typography variant="h5" sx={{mb: 2}}>{t("shipping.ddt_rows.transfer")}</Typography>

            <GenericForm<IDDTTransferForm>
                dialogMode
                dialogRef={ref}
                disabledBasicButtons
                bypassConfirm
                selectedId={null}
                entity={{
                    subcontractor_id: 0,
                    date: dayjs().format("YYYY-MM-DD"),
                    pieces: null,
                    note: "",
                    ddt_number: "",
                    processing_ids: null,
                    closed: false
                }}
                emptyValues={{
                    subcontractor_id: 0,
                    date: dayjs().format("YYYY-MM-DD"),
                    pieces: null,
                    note: "",
                    ddt_number: "",
                    processing_ids: null,
                    closed: false
                }}
                mapEntityToForm={(x) => ({
                    subcontractor_id: x.subcontractor_id,
                    date: x.date,
                    pieces: x.pieces,
                    note: x.note,
                    ddt_number: x.ddt_number,
                    processing_ids: x.processing_ids ? String(x.processing_ids) : null,
                    closed: x.closed
                })}
                create={(payload) => transferSubcontract({
                    ddtRowId: selectedId as number,
                    processing_ids: payload.processing_ids,
                    ddt_number: payload.ddt_number,
                    subcontractor_id: payload.subcontractor_id,
                    date: payload.date,
                    pieces: payload.pieces as number,
                    note: payload.note,
                    closed: payload.closed
                })}
                validateBeforeSave={(v) => !!v.pieces && !!v.subcontractor_id}
                extraButtons={[
                    <CustomButton
                        label={t("common:button.execute")}
                        color={"warning"}
                        icon={<MoveDownIcon/>}
                        isSubmit
                    />
                ]}
                isSaving={isPending}
                renderFields={() => <TransferFormFields selectedRow={selectedRow} />}
            />
        </BaseDialog>
    )
})

export default DDTTransferFormDialog;