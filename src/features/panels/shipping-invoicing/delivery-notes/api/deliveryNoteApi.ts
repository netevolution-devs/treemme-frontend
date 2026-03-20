import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.ts";
import type {IDeliveryNote} from "@features/panels/shipping-invoicing/delivery-notes/api/IDeliveryNote.ts";

export interface IDeliveryNotePayload extends Omit<IDeliveryNote, 'id' | 'subcontractor' | 'reason' | 'client' | 'ddt_rows'> {
    subcontractor_id: number | null;
    client_id: number | null;
    reason_id: number;
}

export const deliveryNoteApi = createPanelApi<IDeliveryNote, IDeliveryNotePayload>({
    baseEndpoint: "/ddt",
    queryKey: "DELIVERY-NOTE"
});