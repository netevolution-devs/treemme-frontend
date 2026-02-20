import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.tsx";
import type {IContactTitle} from "@features/panels/shared/api/contacts-title/IContactTitle.ts";

export const contactsTitleApi = createPanelApi<IContactTitle>({
    baseEndpoint: "/contact-title",
    queryKey: "CONTACT_TITLE"
});