import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory";
import type {IInternalColor} from "@features/panels/products/article-internal-colors/api/IInternalColor";

export const internalColorApi = createPanelApi<IInternalColor>({
    baseEndpoint: "/internal-color",
    queryKey: "INTERNAL-COLOR"
});