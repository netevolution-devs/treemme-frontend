import type {IContact} from "@features/panels/contacts/contacts/api/IContact";

export interface IColor {
    id: number;
    color: string;
    shade: string | null;
    var_color: string | null;
    color_note: string | null;
    client_color: string;
    client: IContact;
}