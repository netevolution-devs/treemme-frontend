import type {IContactType} from "@features/panels/contacts/contacts/api/contacts-type/IContactType.ts";
import type {IContactTitle} from "@features/panels/contacts/contacts/api/contacts-title/IContactTitle.ts";
import type {IContactAddress} from "@features/panels/contacts/contacts/api/contacts-address/IContactAddress.ts";
import type {IContactDetail} from "@features/panels/contacts/contacts/api/contacts-detail/IContactDetail.tsx";

export interface IContact {
    id: number;
    name: string;
    contact_note: string;
    contact_type: IContactType;
    contact_title: IContactTitle;
    contact_addresses: IContactAddress[];
    contact_details: IContactDetail[];
    client: boolean;
    supplier: boolean;
}