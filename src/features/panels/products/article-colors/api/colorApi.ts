import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory";
import type {IColor} from "@features/panels/products/article-colors/api/IColor";
import type {IColorForm} from "@features/panels/products/article-colors/ArticleColorsForm";

export type IColorPayload = IColorForm;

export const colorApi = createPanelApi<IColor, IColorPayload>({
    baseEndpoint: "/color",
    queryKey: "COLOR"
});