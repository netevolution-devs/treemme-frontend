import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.tsx";
import type {IContact} from "@features/panels/contacts/contacts/api/IContact.ts";

interface IContactsPayload extends Omit<IContact, 'id' | 'contact_type' | 'contact_title' | 'contact_addresses'> {
    contact_type_id: number,
    contact_title_id: number,
}

export const contactsApi = createPanelApi<IContact, IContactsPayload>({
    baseEndpoint: "/contact",
    queryKey: "CONTACT"
});