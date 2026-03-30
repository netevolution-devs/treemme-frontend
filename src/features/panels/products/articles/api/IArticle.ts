import type {IContact} from "@features/panels/contacts/contacts/api/IContact.ts";
import type {IArticleType} from "@features/panels/products/article-types/api/IArticleType.ts";
import type {IThickness} from "@features/panels/leathers/thicknesses/api/IThickness.ts";
import type {IArticlePrint} from "@features/panels/products/articles/api/article-print/IArticlePrint.ts";
import type {IProduct} from "@features/panels/products/products/api/IProduct.ts";
import type {IColor} from "@features/panels/products/article-colors/api/IColor.ts";

export interface IArticle {
    id: number;
    name: string;
    code: string;
    client: IContact;
    article_type: IArticleType;
    thickness: IThickness;
    print: IArticlePrint;
    full_grain: boolean;
    article_variation: string;
    note: string;
    product: IProduct;
    color: IColor;
}