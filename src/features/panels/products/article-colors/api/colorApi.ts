import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.ts";
import type {IColor} from "@features/panels/products/article-colors/api/IColor.ts";

export const colorApi = createPanelApi<IColor>({
    baseEndpoint: "/api",
    queryKey: "COLOR"
});