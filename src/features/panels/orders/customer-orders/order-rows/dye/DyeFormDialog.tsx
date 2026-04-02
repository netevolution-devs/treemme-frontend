import {forwardRef, useMemo} from "react";
import type {IDialogActions} from "@ui/dialog/IDialogActions.ts";
import BaseDialog from "@ui/dialog/BaseDialog.tsx";
import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {ICustomerOrdersStoreState} from "@features/panels/orders/customer-orders/CustomerOrdersPanel.tsx";
import usePostBatchDye from "@features/panels/orders/customer-orders/order-rows/dye/api/useBatchDye.ts";
import {machineApi} from "@features/panels/production/machinery/api/machineApi.ts";
import GenericForm from "@features/panels/shared/GenericForm.tsx";
import NumberFieldControlled from "@ui/form/controlled/NumberFieldControlled.tsx";
import DateFieldControlled from "@ui/form/controlled/DateFieldControlled.tsx";
import SelectFieldControlled from "@ui/form/controlled/SelectFieldController.tsx";
import {Box, Typography} from "@mui/material";
import {orderRowApi} from "@features/panels/orders/customer-orders/order-rows/api/orderRowApi.ts";
import dayjs from "dayjs";

export interface IDyeForm {
    quantity: number;
    scheduled_date: string;
    machine_id?: number | null;
}

const DyeFormDialog = forwardRef<IDialogActions>((_, ref) => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, ICustomerOrdersStoreState>();
    const selectedOrderRowId = useStore(state => state.uiState.selectedOrderRowId);

    const {data: orderRow} = orderRowApi.useGetDetail(selectedOrderRowId);

    const {mutateAsync: createBatchDye, isPending} = usePostBatchDye(selectedOrderRowId as number);
    const {data: machines = []} = machineApi.useGetList();

    const machineOptions = useMemo(() => 
        machines.map(m => ({value: m.id, label: m.name})), 
    [machines]);

    return (
        <BaseDialog ref={ref} sx={{p: 2}}>
            <Typography variant={"h5"} sx={{mb: 2}}>{t("orders.row.dye")}</Typography>
            <GenericForm<IDyeForm, unknown, ICustomerOrdersStoreState>
                selectedId={null}
                dialogMode
                dialogRef={ref}
                bypassConfirm
                emptyValues={{
                    quantity: null as unknown as number,
                    scheduled_date: dayjs().format('YYYY-MM-DD'),
                    machine_id: null
                }}
                mapEntityToForm={() => ({
                    quantity: 0,
                    scheduled_date: dayjs().format('YYYY-MM-DD'),
                    machine_id: null
                })}
                create={(data) => {
                    if (!selectedOrderRowId && !data.machine_id) return;
                    return createBatchDye({
                        ...data,
                        machine_id: data.machine_id as number,
                        client_order_row_id: selectedOrderRowId as number
                    });
                }}
                isSaving={isPending}
                validateBeforeSave={(v) => !!v.quantity && v.quantity > 0 && !!v.scheduled_date && !!v.machine_id}
                renderFields={() => (
                    <>
                        <Box sx={{mb: 1}}>
                            <NumberFieldControlled<IDyeForm>
                                name="quantity"
                                label={t("production.batch.quantity")}
                                required
                                max={orderRow?.available_quantity as number}
                            />
                            <DateFieldControlled<IDyeForm>
                                name="scheduled_date"
                                label={t("production.batch.batch_date")}
                                required
                            />
                        </Box>
                        <SelectFieldControlled<IDyeForm>
                            name="machine_id"
                            label={t("production.machinery.name")}
                            options={machineOptions}
                            required
                        />
                    </>
                )}
            />
        </BaseDialog>
    )
});

export default DyeFormDialog;