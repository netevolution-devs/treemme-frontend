import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.tsx";
import type {IArticle} from "@features/panels/products/articles/api/IArticle.ts";
import type {IArticleForm} from "@features/panels/products/articles/ArticlesForm.tsx";

export type IArticlePayload = IArticleForm;

export const articleApi = createPanelApi<IArticle, IArticlePayload>({
    baseEndpoint: "/article",
    queryKey: "ARTICLE"
});