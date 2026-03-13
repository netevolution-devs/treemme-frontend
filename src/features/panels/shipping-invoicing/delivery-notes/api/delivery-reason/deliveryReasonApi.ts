import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.tsx";
import type {
    IDeliveryReason
} from "@features/panels/shipping-invoicing/delivery-notes/api/delivery-reason/IDeliveryReason.ts";

export const deliveryReasonApi = createPanelApi<IDeliveryReason>({
    baseEndpoint: "/ddt-reason",
    queryKey: "DDT-REASON"
});