import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.tsx";
import type {IColor} from "@features/panels/products/products/api/color/IColor.ts";

export const colorApi = createPanelApi<IColor>({
    baseEndpoint: "/color",
    queryKey: "COLOR"
});