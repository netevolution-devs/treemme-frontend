import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory";
import type {IArticle} from "@features/panels/products/articles/api/IArticle";
import type {IArticleForm} from "@features/panels/products/articles/ArticlesForm";

export type IArticlePayload = IArticleForm;

export const articleApi = createPanelApi<IArticle, IArticlePayload>({
    baseEndpoint: "/article",
    queryKey: "ARTICLE"
});