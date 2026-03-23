import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.ts";
import type {
    IContactDetailType
} from "@features/panels/contacts/contacts/api/contacts-detail-type/IContactDetailTypes.tsx";

export const contactsDetailTypeApi = createPanelApi<IContactDetailType>({
    baseEndpoint: "/contact-detail-type",
    queryKey: "CONTACT_DETAIL_TYPE"
});