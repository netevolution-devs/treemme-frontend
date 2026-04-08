import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory";
import type {
    IDeliveryNoteRow
} from "@features/panels/shipping-invoicing/delivery-notes/delivery-notes-row/api/IDeliveryNoteRow";
import type {
    IDeliveryNoteRowForm
} from "@features/panels/shipping-invoicing/delivery-notes/delivery-notes-row/DeliveryNotesRowsForm";

type IDeliveryNoteRowPayload = IDeliveryNoteRowForm;

export const deliveryNoteRowApi = createPanelApi<IDeliveryNoteRow, IDeliveryNoteRowPayload>({
    baseEndpoint: "/ddt-row",
    queryKey: "DELIVERY-NOTE-ROW"
});