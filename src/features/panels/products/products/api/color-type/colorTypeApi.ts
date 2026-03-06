import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.tsx";
import type {IColorType} from "@features/panels/products/products/api/color-type/IColorType.ts";

export const colorTypeApi = createPanelApi<IColorType>({
    baseEndpoint: "/color-type",
    queryKey: "COLOR-TYPE"
});