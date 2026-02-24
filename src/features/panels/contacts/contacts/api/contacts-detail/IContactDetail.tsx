import type {
    IContactDetailType
} from "@features/panels/contacts/contacts/api/contacts-detail-type/IContactDetailTypes.tsx";

export interface IContactDetail {
    id: number;
    name: string;
    note: string;
    detail_type: IContactDetailType;
}