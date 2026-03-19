import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.tsx";
import type {IArticlePrint} from "@features/panels/products/articles/api/article-print/IArticlePrint.ts";

export const articlePrintApi = createPanelApi<IArticlePrint>({
    baseEndpoint: "/article-print",
    queryKey: "ARTICLE-PRINT"
});