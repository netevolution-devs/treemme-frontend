import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory";
import type {IArticleType} from "@features/panels/products/article-types/api/IArticleType";
import type {IArticleTypeForm} from "@features/panels/products/article-types/ArticleTypesForm";

export const articleTypeApi = createPanelApi<IArticleType, IArticleTypeForm>({
    baseEndpoint: "/article-type",
    queryKey: "ARTICLE-TYPE"
});