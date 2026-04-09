import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory";
import type {IContactType} from "@features/panels/contacts/contacts/api/contacts-type/IContactType";

export const contactsTypeApi = createPanelApi<IContactType>({
    baseEndpoint: "/contact-type",
    queryKey: "CONTACT_TYPE"
})