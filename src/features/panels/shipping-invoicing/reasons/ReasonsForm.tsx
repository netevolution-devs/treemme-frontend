import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {IReasonsStoreState} from "@features/panels/shipping-invoicing/reasons/ReasonsPanel.tsx";
import {
    deliveryReasonApi,
    type IDeliveryReasonPayload
} from "@features/panels/shipping-invoicing/reasons/api/deliveryReasonApi.ts";
import {warehouseMovementReasonApi} from "@features/panels/shared/api/warehouse-movement/warehouseMovementReasonApi.ts";
import type {IDeliveryReason} from "@features/panels/shipping-invoicing/reasons/api/IDeliveryReason.ts";
import GenericForm from "@features/panels/shared/GenericForm.tsx";
import SelectFieldControlled from "@ui/form/controlled/SelectFieldController.tsx";
import TextFieldControlled from "@ui/form/controlled/TextFieldControlled.tsx";

export type IDeliveryReasonForm = Omit<IDeliveryReason, "id" | "warehouse_movement_reason"> & {
    warehouse_movement_reason_id: number | null;
};

const ReasonsForm = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, IReasonsStoreState>();
    const selectedDeliveryReasonId = useStore(state => state.uiState.selectedDeliveryReasonId);
    const setUIState = useStore(state => state.setUIState);

    const {useGetDetail, usePost, usePut, useDelete} = deliveryReasonApi;
    const {data: deliveryReason} = useGetDetail(selectedDeliveryReasonId);
    const {mutateAsync: createReason, isPending: isPosting} = usePost();
    const {mutateAsync: updateReason, isPending: isPutting} = usePut();
    const {mutateAsync: deleteReason, isPending: isDeleting} = useDelete();

    const {data: warehouseMovementReasons = []} = warehouseMovementReasonApi.useGetList();

    return (
        <GenericForm<IDeliveryReasonForm, IDeliveryReason, IReasonsStoreState>
            selectedId={selectedDeliveryReasonId}
            entity={deliveryReason}
            emptyValues={{
                name: "",
                warehouse_movement_reason_id: null,
            }}
            mapEntityToForm={(x) => ({
                name: x.name,
                warehouse_movement_reason_id: x.warehouse_movement_reason?.id ?? null,
            })}
            create={(payload) => createReason(payload as IDeliveryReasonPayload)}
            update={(id, payload) => updateReason({id, payload: payload as IDeliveryReasonPayload})}
            remove={(id) => deleteReason(id)}
            isSaving={isPosting || isPutting}
            isDeleting={isDeleting}
            onClearSelection={() => setUIState({selectedDeliveryReasonId: null})}
            validateBeforeSave={(v) => !!v.name && !!v.warehouse_movement_reason_id}
            renderFields={() => (
                <>
                    <TextFieldControlled<IDeliveryReasonForm>
                        name="name"
                        label={t("shipping.reasons.name")}
                        required
                    />
                    <SelectFieldControlled<IDeliveryReasonForm>
                        name="warehouse_movement_reason_id"
                        label={t("shipping.reasons.warehouse_movement_reason")}
                        options={warehouseMovementReasons.map(x => ({label: x.name, value: x.id}))}
                        required
                    />
                </>
            )}
        />
    )
}

export default ReasonsForm;
