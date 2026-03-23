import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.ts";
import type {ISelection} from "@features/panels/products/selection/api/ISelection.ts";

export const selectionApi = createPanelApi<ISelection>({
    baseEndpoint: "/selection",
    queryKey: "SELECTION"
});