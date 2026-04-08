import type {IContact} from "@features/panels/contacts/contacts/api/IContact";
import type {IInternalColor} from "@features/panels/products/article-internal-colors/api/IInternalColor";

export interface IColor {
    id: number;
    color: string;
    color_note: string | null;
    client: IContact;
    internal_color: IInternalColor;
    // shade: string | null;
    // var_color: string | null;
    // client_color: string;
}