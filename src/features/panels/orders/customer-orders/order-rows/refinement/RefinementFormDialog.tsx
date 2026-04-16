import {forwardRef} from "react";
import type {IDialogActions} from "@ui/dialog/IDialogActions";
import BaseDialog from "@ui/dialog/BaseDialog";
import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext";
import type {ICustomerOrdersStoreState} from "@features/panels/orders/customer-orders/CustomerOrdersPanel";
import GenericForm from "@features/panels/shared/GenericForm";
import NumberFieldControlled from "@ui/form/controlled/NumberFieldControlled";
import DateFieldControlled from "@ui/form/controlled/DateFieldControlled";
import {Box, Typography} from "@mui/material";
import {orderRowApi} from "@features/panels/orders/customer-orders/order-rows/api/orderRowApi";
import useBatchRefinement from "@features/panels/orders/customer-orders/order-rows/refinement/api/useBatchRefinement";
import dayjs from "dayjs";
import {useDockviewStore} from "@ui/panel/store/DockviewStore";

interface RefinementFormDialogProps {
    order_row_id?: number;
}

export interface IRefinementForm {
    quantity: number;
    scheduled_date: string;
}

const RefinementFormDialog = forwardRef<IDialogActions, RefinementFormDialogProps>(({order_row_id}, ref) => {
    const {t} = useTranslation(["form"]);

    const addPanel = useDockviewStore(state => state.addPanel);
    const {useStore} = usePanel<unknown, ICustomerOrdersStoreState>();
    const selectedOrderRowId = useStore(state => state.uiState.selectedOrderRowId) || order_row_id;

    const {data: orderRow} = orderRowApi.useGetDetail(selectedOrderRowId);

    const {mutateAsync: createBatchRefinement, isPending} = useBatchRefinement(selectedOrderRowId as number);

    return (
        <BaseDialog ref={ref} sx={{p: 2}}>
            <Typography variant={"h5"} sx={{mb: 2}}>{t("orders.row.refinement")}</Typography>
            <GenericForm<IRefinementForm, unknown, ICustomerOrdersStoreState>
                resource="ordini - ordini clienti"
                selectedId={null}
                dialogMode
                dialogRef={ref}
                bypassConfirm
                emptyValues={{
                    quantity: null as unknown as number,
                    scheduled_date: dayjs().format('YYYY-MM-DD'),
                }}
                mapEntityToForm={() => ({
                    quantity: 0,
                    scheduled_date: dayjs().format('YYYY-MM-DD'),
                })}
                create={async (data) => {
                    if (!selectedOrderRowId) return;
                    const newBatch = await createBatchRefinement({
                        ...data,
                        client_order_row_id: selectedOrderRowId
                    });
                    addPanel({
                        id: `batches:${crypto.randomUUID()}`,
                        title: t("menu:menu.production.batches"),
                        component: 'batches',
                        params: {
                            extra: {
                                id: newBatch?.id as number,
                                batch_code: newBatch?.batch_code as string
                            }
                        }
                    });
                }}
                isSaving={isPending}
                validateBeforeSave={(v) => !!v.quantity && v.quantity > 0 && !!v.scheduled_date}
                renderFields={() => (
                    <Box sx={{mb: 1}}>
                        <NumberFieldControlled<IRefinementForm>
                            name="quantity"
                            label={t("production.batch.quantity")}
                            required
                            max={orderRow?.available_quantity as number}
                        />
                        <DateFieldControlled<IRefinementForm>
                            name="scheduled_date"
                            label={t("production.batch.batch_date")}
                            required
                        />
                    </Box>
                )}
            />
        </BaseDialog>
    )
});

export default RefinementFormDialog;