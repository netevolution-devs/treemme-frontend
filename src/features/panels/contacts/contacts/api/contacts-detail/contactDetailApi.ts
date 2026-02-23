import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.tsx";
import type {IContactDetail} from "@features/panels/contacts/contacts/api/contacts-detail/IContactDetail.tsx";

export const contactDetailApi = createPanelApi<IContactDetail>({
    baseEndpoint: "/contact-detail",
    queryKey: "CONTACT_DETAIL"
});