import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.tsx";
import type {IContactType} from "@features/panels/shared/api/contacts-type/IContactType.ts";

export const contactsTypeApi = createPanelApi<IContactType>({
    baseEndpoint: "/contact_type",
    queryKey: "CONTACT_TYPE"
})