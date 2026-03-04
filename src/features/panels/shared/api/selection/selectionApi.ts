import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.tsx";
import type {ISelection} from "@features/panels/shared/api/selection/ISelection.ts";

export const selectionApi = createPanelApi<ISelection>({
    baseEndpoint: "/selection",
    queryKey: "SELECTION"
});