import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.tsx";
import type {IContactTitle} from "@features/panels/shared/api/contact-title/IContactTitle.ts";

export const contactTitleApi = createPanelApi<IContactTitle>({
    baseEndpoint: "/contact-title",
    queryKey: "CONTACT_TITLE"
});