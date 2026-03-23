import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.ts";
import type {IColor} from "@features/panels/products/articles/api/color/IColor.ts";

export const colorApi = createPanelApi<IColor>({
    baseEndpoint: "/color",
    queryKey: "COLOR"
});