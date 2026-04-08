import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory";
import type {IArticleClass} from "@features/panels/products/article-classes/api/IArticleClass";

export const articleClassApi = createPanelApi<IArticleClass>({
    baseEndpoint: "/article-class",
    queryKey: "ARTICLE-CLASS"
});