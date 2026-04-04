import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.ts";
import type {IContactAddress} from "@features/panels/contacts/contacts/api/contacts-address/IContactAddress.ts";
import type {IContactAddressForm} from "@features/panels/contacts/contacts/address/ContactsAddressFormDialog.tsx";

export type IContactsAddressPayload = IContactAddressForm;

export const contactsAddressApi = createPanelApi<IContactAddress, IContactsAddressPayload>({
    baseEndpoint: "/contact-address",
    queryKey: "CONTACT_ADDRESS"
});