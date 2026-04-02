import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.ts";
import type {
    IDeliveryNoteRow
} from "@features/panels/shipping-invoicing/delivery-notes/delivery-notes-row/api/IDeliveryNoteRow.ts";
import type {
    IDeliveryNoteRowForm
} from "@features/panels/shipping-invoicing/delivery-notes/delivery-notes-row/DeliveryNotesRowsForm.tsx";

type IDeliveryNoteRowPayload = IDeliveryNoteRowForm;

export const deliveryNoteRowApi = createPanelApi<IDeliveryNoteRow, IDeliveryNoteRowPayload>({
    baseEndpoint: "/ddt-row",
    queryKey: "DELIVERY-NOTE-ROW"
});