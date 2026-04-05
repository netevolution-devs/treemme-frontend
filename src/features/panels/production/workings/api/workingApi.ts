import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory";
import type {IWorking} from "@features/panels/production/workings/api/IWorking";

export const workingApi = createPanelApi<IWorking>({
    baseEndpoint: "/processing",
    queryKey: "WORKING"
});