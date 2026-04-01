import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.ts";
import type {IColor} from "@features/panels/products/article-colors/api/IColor.ts";
import type {IColorForm} from "@features/panels/products/article-colors/ArticleColorsForm.tsx";

export type IColorPayload = IColorForm;

export const colorApi = createPanelApi<IColor, IColorPayload>({
    baseEndpoint: "/color",
    queryKey: "COLOR"
});