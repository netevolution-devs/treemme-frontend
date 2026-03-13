import type {IContact} from "@features/panels/contacts/contacts/api/IContact.ts";
import type {
    IDeliveryReason
} from "@features/panels/shipping-invoicing/reasons/api/IDeliveryReason.ts";

export interface IDeliveryNote {
    id: number;
    subcontractor: IContact;
    ddt_number: string;
    ddt_date: string;
    ddt_start_date: string;
    reason: IDeliveryReason;
}