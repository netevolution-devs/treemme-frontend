import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory";
import type {IContact} from "@features/panels/contacts/contacts/api/IContact";
import type {IContactForm} from "@features/panels/contacts/contacts/ContactsForm";

type IContactsPayload = IContactForm;

export const contactsApi = createPanelApi<IContact, IContactsPayload>({
    baseEndpoint: "/contact",
    queryKey: "CONTACT"
});