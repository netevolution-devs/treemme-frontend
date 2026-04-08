import type {IContact} from "@features/panels/contacts/contacts/api/IContact";

export interface IColor {
    id: number;
    color: string;
    color_note: string | null;
    client: IContact;
    // shade: string | null;
    // var_color: string | null;
    // client_color: string;
}