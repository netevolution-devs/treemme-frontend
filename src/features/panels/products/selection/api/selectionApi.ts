import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory";
import type {ISelection} from "@features/panels/products/selection/api/ISelection";

export const selectionApi = createPanelApi<ISelection>({
    baseEndpoint: "/selection",
    queryKey: "SELECTION"
});