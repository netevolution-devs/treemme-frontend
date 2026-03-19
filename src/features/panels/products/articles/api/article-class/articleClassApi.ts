import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.tsx";
import type {IArticleClass} from "@features/panels/products/articles/api/article-class/IArticleClass.ts";

export const articleClassApi = createPanelApi<IArticleClass>({
    baseEndpoint: "/article-class",
    queryKey: "ARTICLE-CLASS"
});