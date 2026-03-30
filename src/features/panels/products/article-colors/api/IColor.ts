import type {IContact} from "@features/panels/contacts/contacts/api/IContact.ts";

export interface IColor {
    id: number;
    color: string;
    shade: string | null;
    var_color: string | null;
    color_note: string | null;
    client: IContact;
}