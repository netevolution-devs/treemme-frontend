import {forwardRef} from "react";
import type {IDialogActions} from "@ui/dialog/IDialogActions.ts";
import BaseDialog from "@ui/dialog/BaseDialog.tsx";
import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import {Box, Stack, Typography} from "@mui/material";
import GenericForm from "@features/panels/shared/GenericForm.tsx";
import CustomButton from "@features/panels/shared/CustomButton.tsx";
import DateFieldControlled from "@ui/form/controlled/DateFieldControlled.tsx";
import NumberFieldControlled from "@ui/form/controlled/NumberFieldControlled.tsx";
import dayjs from "dayjs";
import type {ISubcontractingNotReturnedStoreState} from "@features/panels/shipping-invoicing/subcontracting-not-returned/SubcontractingNotReturnedPanel.tsx";
import usePostSubcontractingTransfer from "@features/panels/shipping-invoicing/subcontracting-not-returned/transfer/api/usePostSubcontractingTransfer.ts";
import MoveDownIcon from '@mui/icons-material/MoveDown';
import useGetDDTNotReturned from "@features/panels/shipping-invoicing/subcontracting-not-returned/api/useGetDDTNotReturned.ts";
import {contactsApi} from "@features/panels/contacts/contacts/api/contactsApi.ts";
import SelectFieldControlled from "@ui/form/controlled/SelectFieldController.tsx";

type Props = unknown;

export type IDDTTransferForm = {
    subcontractor_id: number;
    date: string;
    pieces: number;
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
                    pieces: 0,
                }}
                emptyValues={{
                    subcontractor_id: 0,
                    date: dayjs().format("YYYY-MM-DD"),
                    pieces: 0,
                }}
                mapEntityToForm={(x) => ({
                    subcontractor_id: x.subcontractor_id,
                    date: x.date,
                    pieces: x.pieces
                })}
                create={(payload) => transferSubcontract({
                    ddtRowId: selectedId as number,
                    subcontractor_id: payload.subcontractor_id,
                    date: payload.date,
                    pieces: payload.pieces
                })}
                validateBeforeSave={(v) => v.pieces > 0 && v.subcontractor_id > 0}
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
                    </Stack>
                )}
            />
        </BaseDialog>
    )
})

export default DDTTransferFormDialog;