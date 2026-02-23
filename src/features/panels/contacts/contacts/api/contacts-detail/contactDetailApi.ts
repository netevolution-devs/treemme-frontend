import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.tsx";
import type {IContactDetail} from "@features/panels/contacts/contacts/api/contacts-detail/IContactDetail.tsx";

export interface IContactDetailPayload extends Omit<IContactDetail, 'id' | 'detail_type'>{
    detail_type_id: number,
}

export const contactsDetailApi = createPanelApi<IContactDetail, IContactDetailPayload>({
    baseEndpoint: "/contact-detail",
    queryKey: "CONTACT_DETAIL"
});