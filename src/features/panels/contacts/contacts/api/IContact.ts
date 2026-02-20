import type {IContactType} from "@features/panels/shared/api/contacts-type/IContactType.ts";
import type {IContactTitle} from "@features/panels/shared/api/contacts-title/IContactTitle.ts";

export interface IContact {
    id: number;
    name: string;
    contact_note: string;
    contact_type: IContactType;
    contact_title: IContactTitle;
}