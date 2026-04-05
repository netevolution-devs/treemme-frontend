import type {IContact} from "@features/panels/contacts/contacts/api/IContact";
import type {IArticleType} from "@features/panels/products/article-types/api/IArticleType";
import type {IThickness} from "@features/panels/leathers/thicknesses/api/IThickness";
import type {IArticlePrint} from "@features/panels/products/articles/api/article-print/IArticlePrint";
import type {IProduct} from "@features/panels/products/products/api/IProduct";
import type {IColor} from "@features/panels/products/article-colors/api/IColor";

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
    client_code: string | null;
}