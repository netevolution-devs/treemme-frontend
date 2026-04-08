import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory";
import type {
    IDeliveryReason
} from "@features/panels/shipping-invoicing/reasons/api/IDeliveryReason";

export interface IDeliveryReasonPayload extends Omit<IDeliveryReason, 'id' | 'warehouse_movement_reason'> {
    warehouse_movement_reason_id: number;
}

export const deliveryReasonApi = createPanelApi<IDeliveryReason, IDeliveryReasonPayload>({
    baseEndpoint: "/ddt-reason",
    queryKey: "DDT-REASON"
});