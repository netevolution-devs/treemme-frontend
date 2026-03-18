import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.tsx";
import type {IWorking} from "@features/panels/production/workings/api/IWorking.ts";

export const workingApi = createPanelApi<IWorking>({
    baseEndpoint: "/processing",
    queryKey: "WORKING"
});