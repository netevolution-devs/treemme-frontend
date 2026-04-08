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
import type {ISubcontractingNotReturnedStoreState} from "@features/panels/shipping-invoicing/subcontracting-not-returned/SubcontractingNotReturnedPanel";
import usePostSubcontractingTransfer from "@features/panels/shipping-invoicing/subcontracting-not-returned/transfer/api/usePostSubcontractingTransfer";
import MoveDownIcon from '@mui/icons-material/MoveDown';
import useGetDDTNotReturned from "@features/panels/shipping-invoicing/subcontracting-not-returned/api/useGetDDTNotReturned";
import {contactsApi} from "@features/panels/contacts/contacts/api/contactsApi";
import SelectFieldControlled from "@ui/form/controlled/SelectFieldController";
import TextFieldControlled from "@ui/form/controlled/TextFieldControlled";

type Props = unknown;

export type IDDTTransferForm = {
    subcontractor_id: number;
    date: string;
    pieces: number | null;
    note: string;
}

const DDTTransferFormDialog = forwardRef<IDialogActions, Props>((_props, ref) => {
    const {t} = useTranslation(["form", "common"]);

    const {useStore} = usePanel<unknown, ISubcontractingNotReturnedStoreState>();
    const selectedId = useStore((state) => state.uiState.selectedSubcontractingNotReturnedId);

    const {data: ddtRowsNotReturned = []} = useGetDDTNotReturned();
    const selectedRow = ddtRowsNotReturned.find(x => x.id === selectedId);

    const {data: contacts = []} = contactsApi.useGetList();
    const subcontractors = contacts.filter(c => c.subcontractor);

    const {mutateAsync: transferSubcontract, isPending} = usePostSubcontractingTransfer();

    return (
        <BaseDialog ref={ref} sx={{p: 2}}>
            <Typography variant="h5" sx={{mb: 2}}>{t("shipping.ddt_rows.transfer")}</Typography>

            <GenericForm<IDDTTransferForm>
                dialogMode
                dialogRef={ref}
                disabledBasicButtons
                bypassConfirm
                selectedId={selectedId}
                entity={{
                    subcontractor_id: 0,
                    date: dayjs().format("YYYY-MM-DD"),
                    pieces: null,
                    note: "",
                }}
                emptyValues={{
                    subcontractor_id: 0,
                    date: dayjs().format("YYYY-MM-DD"),
                    pieces: null,
                    note: "",
                }}
                mapEntityToForm={(x) => ({
                    subcontractor_id: x.subcontractor_id,
                    date: x.date,
                    pieces: x.pieces,
                    note: x.note
                })}
                create={(payload) => transferSubcontract({
                    ddtRowId: selectedId as number,
                    subcontractor_id: payload.subcontractor_id,
                    date: payload.date,
                    pieces: payload.pieces as number,
                    note: payload.note
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
                renderFields={() => (
                    <Stack gap={1}>
                        <SelectFieldControlled<IDDTTransferForm>
                            name={"subcontractor_id"}
                            label={t("shipping.subcontractor")}
                            options={subcontractors.map(s => ({value: s.id, label: s.name}))}
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
                        <TextFieldControlled<IDDTTransferForm>
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

export default DDTTransferFormDialog;