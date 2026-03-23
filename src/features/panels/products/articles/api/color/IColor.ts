import type {IColorType} from "@features/panels/products/articles/api/color-type/IColorType.ts";

export interface IColor {
    id: number;
    color_type: IColorType;
    color: string;
    shade: string | null;
    var_color: string | null;
    color_note: string | null;
    client_color: string;
}