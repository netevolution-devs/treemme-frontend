import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.tsx";
import type {IContactType} from "@features/panels/shared/api/contact-type/IContactType.ts";

export const contactTypeApi = createPanelApi<IContactType>({
    baseEndpoint: "/contact_type",
    queryKey: "CONTACT_TYPE"
})