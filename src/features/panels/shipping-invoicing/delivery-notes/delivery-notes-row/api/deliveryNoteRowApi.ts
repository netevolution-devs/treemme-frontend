import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.ts";
import type {
    IDeliveryNoteRow
} from "@features/panels/shipping-invoicing/delivery-notes/delivery-notes-row/api/IDeliveryNoteRow.ts";

export interface IDeliveryNoteRowPayload extends Omit<IDeliveryNoteRow, 'id' | 'batch' | 'measurement_unit' | 'currency' | 'selection'> {
    batch_id: number;
    measurement_unit_id: number;
    currency_id: number | null;
    selection_id: number | null;
    ddt_id: number;
}

export const deliveryNoteRowApi = createPanelApi<IDeliveryNoteRow, IDeliveryNoteRowPayload>({
    baseEndpoint: "/ddt-row",
    queryKey: "DELIVERY-NOTE-ROW"
});