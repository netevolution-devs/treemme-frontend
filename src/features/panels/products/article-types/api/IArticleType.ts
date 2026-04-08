import type {ILeatherType} from "@features/panels/leathers/types/api/ILeatherType";
import type {IArticleClass} from "@features/panels/products/article-classes/api/IArticleClass";

export interface IArticleType {
    id: number;
    leather_type: ILeatherType;
    article_class: IArticleClass;
    name: string;
}