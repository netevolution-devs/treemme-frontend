import type {ILeatherType} from "@features/panels/leathers/types/api/ILeatherType.ts";
import type {IArticleClass} from "@features/panels/products/article-classes/api/IArticleClass.ts";

export interface IArticleType {
    id: number;
    leather_type: ILeatherType;
    article_class: IArticleClass;
    name: string;
}