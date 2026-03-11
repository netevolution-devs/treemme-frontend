import type {IContact} from "@features/panels/contacts/contacts/api/IContact.ts";
import type {IArticleType} from "@features/panels/products/article-types/api/IArticleType.ts";
import type {IThickness} from "@features/panels/leathers/thicknesses/api/IThickness.ts";
import type {IArticlePrint} from "@features/panels/products/articles/api/article-print/IArticlePrint.ts";
import type {IColorType} from "@features/panels/products/articles/api/color-type/IColorType.ts";
import type {IProduct} from "@features/panels/products/products/api/IProduct.ts";

export interface IArticle {
    id: number;
    code: string;
    client: IContact;
    article_type: IArticleType;
    thickness: IThickness;
    print: IArticlePrint;
    color_type: IColorType;
    full_grain: boolean;
    article_variation: string;
    note: string;
    shade: string;
    color: string;
    color_variation: string;
    color_note: string;
    client_color: string;
    product: IProduct;
}