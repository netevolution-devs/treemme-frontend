import type {IContactType} from "@features/panels/contacts/contacts/api/contacts-type/IContactType";
import type {IContactAddress} from "@features/panels/contacts/contacts/api/contacts-address/IContactAddress";
import type {IContactDetail} from "@features/panels/contacts/contacts/api/contacts-detail/IContactDetail";
import type {IPayment} from "@features/panels/commercial/payment-types/api/IPayment";
import type {
    IShipmentCondition
} from "@features/panels/commercial/shipment-conditions/api/IShipmentCondition";

export interface IContact {
    id: number;
    name: string;
    contact_note: string;
    contact_type: IContactType;
    contact_addresses: IContactAddress[];
    contact_details: IContactDetail[];
    client_note: string | null;
    client: boolean;
    supplier: boolean;
    agent: boolean;
    subcontractor: boolean;
    client_shipment_note: string | null;
    specific_order_reference: string | null;
    agent_percentage: number | null;
    contact_agents: { agent: IContact }[];
    contact_subcontractors: { subcontractor: IContact }[];
    agent_clients: { contact: IContact }[];
    subcontractor_suppliers: { contact: IContact }[];
    payment: IPayment;
    shipment_condition: IShipmentCondition;
}