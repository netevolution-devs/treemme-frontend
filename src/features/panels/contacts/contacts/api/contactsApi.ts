import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.tsx";
import type {IContact} from "@features/panels/contacts/contacts/api/IContact.ts";

interface IContactsPayload extends Omit<IContact, 'id'
    | 'contact_title'
    | 'contact_type'
    | 'contact_addresses'
    | 'contact_details'
    | 'contact_agents'
    | 'tolerance_quantity'
    | 'client_shipment_note'
    | 'tolerance_start_days'
    | 'specific_order_reference'
    | 'agent_percentage'
> {
    contact_type_id: number,
    contact_title_id: number,
}

export const contactsApi = createPanelApi<IContact, IContactsPayload>({
    baseEndpoint: "/contact",
    queryKey: "CONTACT"
});