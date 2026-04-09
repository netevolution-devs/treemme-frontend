import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory";
import type {IContactAddress} from "@features/panels/contacts/contacts/api/contacts-address/IContactAddress";
import type {IContactAddressForm} from "@features/panels/contacts/contacts/address/ContactsAddressFormDialog";

export type IContactsAddressPayload = IContactAddressForm;

export const contactsAddressApi = createPanelApi<IContactAddress, IContactsAddressPayload>({
    baseEndpoint: "/contact-address",
    queryKey: "CONTACT_ADDRESS"
});