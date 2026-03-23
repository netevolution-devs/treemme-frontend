import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.ts";
import type {IContactType} from "@features/panels/contacts/contacts/api/contacts-type/IContactType.ts";

export const contactsTypeApi = createPanelApi<IContactType>({
    baseEndpoint: "/contact-type",
    queryKey: "CONTACT_TYPE"
})