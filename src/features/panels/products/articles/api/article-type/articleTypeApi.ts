import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.tsx";
import type {IArticleType} from "@features/panels/products/articles/api/article-type/IArticleType.ts";

export const articleTypeApi = createPanelApi<IArticleType>({
    baseEndpoint: "/article-type",
    queryKey: "ARTICLE-TYPE"
});