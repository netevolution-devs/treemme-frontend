import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.tsx";
import type {IContact} from "@features/panels/contacts/contacts/api/IContact.ts";

export const contactsApi = createPanelApi<IContact>({
    baseEndpoint: "/contact",
    queryKey: "CONTACT"
});