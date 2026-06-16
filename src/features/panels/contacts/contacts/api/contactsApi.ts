import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory";
import type {IContact} from "@features/panels/contacts/contacts/api/IContact";
import type {IContactForm} from "@features/panels/contacts/contacts/ContactsForm";
import useApi from "@api/useApi";
import {useQuery} from "@tanstack/react-query";
import type {IContactAddress} from "@features/panels/contacts/contacts/api/contacts-address/IContactAddress";

type IContactsPayload = IContactForm;

export const contactsApi = {
    ...createPanelApi<IContact, IContactsPayload>({
        baseEndpoint: "/contact",
        queryKey: "CONTACT"
    }),
    useGetContactAddressDetail: (contact_id: number) => {
        const {get} = useApi();
        return useQuery({
            queryKey: ["CONTACT", "ADDRESS", contact_id],
            queryFn: async () => {
                const response = await get<IContactAddress[]>(`/contact/${contact_id}/contact-address`);
                return response.data.data;
            },
            enabled: !!contact_id,
        });
    },
}