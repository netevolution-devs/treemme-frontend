import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.ts";
import type {IContactAddress} from "@features/panels/contacts/contacts/api/contacts-address/IContactAddress.ts";

interface IContactsAddressPayload extends Omit<IContactAddress, 'id' | 'nation' | 'town'> {
    town_id: number,
    nation_id: number,
    contact_id: number,
}

export const contactsAddressApi = createPanelApi<IContactAddress, IContactsAddressPayload>({
    baseEndpoint: "/contact-address",
    queryKey: "CONTACT_ADDRESS"
});