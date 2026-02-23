import type {IContactType} from "@features/panels/contacts/contacts/api/contacts-type/IContactType.ts";
import type {IContactTitle} from "@features/panels/contacts/contacts/api/contacts-title/IContactTitle.ts";
import type {IContactAddress} from "@features/panels/contacts/contacts/api/contacts-address/IContactAddress.ts";

export interface IContact {
    id: number;
    name: string;
    contact_note: string;
    contact_type: IContactType;
    contact_title: IContactTitle;
    contact_addresses: IContactAddress[];
}