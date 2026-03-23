import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.ts";
import type {IArticleType} from "@features/panels/products/article-types/api/IArticleType.ts";
import type {IArticleTypeForm} from "@features/panels/products/article-types/ArticleTypesForm.tsx";

export const articleTypeApi = createPanelApi<IArticleType, IArticleTypeForm>({
    baseEndpoint: "/article-type",
    queryKey: "ARTICLE-TYPE"
});