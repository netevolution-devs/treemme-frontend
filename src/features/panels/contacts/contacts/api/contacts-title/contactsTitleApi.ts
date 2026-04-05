import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory";
import type {IContactTitle} from "@features/panels/contacts/contacts/api/contacts-title/IContactTitle";

export const contactsTitleApi = createPanelApi<IContactTitle>({
    baseEndpoint: "/contact-title",
    queryKey: "CONTACT_TITLE"
});