import type {IContactType} from "@features/panels/contacts/contacts/api/contacts-type/IContactType.ts";
import type {IContactAddress} from "@features/panels/contacts/contacts/api/contacts-address/IContactAddress.ts";
import type {IContactDetail} from "@features/panels/contacts/contacts/api/contacts-detail/IContactDetail.tsx";

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
    contact_agents: { agent: IContact }[];
    contact_subcontractors: { subcontractor: IContact }[];
    agent_percentage: number | null;
}