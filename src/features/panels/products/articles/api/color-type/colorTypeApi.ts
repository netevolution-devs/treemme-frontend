import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.ts";
import type {IColorType} from "@features/panels/products/articles/api/color-type/IColorType.ts";

export const colorTypeApi = createPanelApi<IColorType>({
    baseEndpoint: "/color-type",
    queryKey: "COLOR-TYPE"
});