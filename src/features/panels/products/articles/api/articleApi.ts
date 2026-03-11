import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.tsx";
import type {IArticle} from "@features/panels/products/articles/api/IArticle.ts";

export const articleApi = createPanelApi<IArticle>({
    baseEndpoint: "/article",
    queryKey: "ARTICLE"
});