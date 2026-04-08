import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory";
import type {IArticlePrint} from "@features/panels/products/articles/api/article-print/IArticlePrint";

export const articlePrintApi = createPanelApi<IArticlePrint>({
    baseEndpoint: "/article-print",
    queryKey: "ARTICLE-PRINT"
});