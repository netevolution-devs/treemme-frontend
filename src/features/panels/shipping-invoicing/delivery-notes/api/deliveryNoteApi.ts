import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.tsx";
import type {IDeliveryNote} from "@features/panels/shipping-invoicing/delivery-notes/api/IDeliveryNote.ts";

export const deliveryNoteApi = createPanelApi<IDeliveryNote>({
    baseEndpoint: "/ddt",
    queryKey: "DELIVERY-NOTE"
});