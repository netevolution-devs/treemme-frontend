import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.tsx";
import type {ILeather} from "@features/panels/leathers/leathers/api/ILeather.ts";

export const leatherApi = createPanelApi<ILeather>({
    baseEndpoint: "/leather",
    queryKey: "LEATHER"
});