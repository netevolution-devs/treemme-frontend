import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory";
import type {IContactDetail} from "@features/panels/contacts/contacts/api/contacts-detail/IContactDetail";

export interface IContactDetailPayload extends Omit<IContactDetail, 'id' | 'detail_type'>{
    detail_type_id: number,
    contact_id: number,
}

export const contactsDetailApi = createPanelApi<IContactDetail, IContactDetailPayload>({
    baseEndpoint: "/contact-detail",
    queryKey: "CONTACT_DETAIL"
});