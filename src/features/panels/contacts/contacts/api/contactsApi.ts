import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.ts";
import type {IContact} from "@features/panels/contacts/contacts/api/IContact.ts";
import type {IContactForm} from "@features/panels/contacts/contacts/ContactsForm.tsx";

type IContactsPayload = IContactForm;

export const contactsApi = createPanelApi<IContact, IContactsPayload>({
    baseEndpoint: "/contact",
    queryKey: "CONTACT"
});