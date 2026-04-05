import type {IContact} from "@features/panels/contacts/contacts/api/IContact";
import type {
    IDeliveryReason
} from "@features/panels/shipping-invoicing/reasons/api/IDeliveryReason";
import type {
    IDeliveryNoteRow
} from "@features/panels/shipping-invoicing/delivery-notes/delivery-notes-row/api/IDeliveryNoteRow";

export interface IDeliveryNote {
    id: number;
    subcontractor: IContact | null;
    client: IContact | null;
    ddt_number: string;
    ddt_date: string;
    ddt_start_date: string;
    reason: IDeliveryReason
    ddt_rows: IDeliveryNoteRow[];
}