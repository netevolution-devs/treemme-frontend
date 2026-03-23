import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.ts";
import type {IProcess} from "@features/panels/production/processes/api/IProcess.ts";

export const processApi = createPanelApi<IProcess>({
    baseEndpoint: "/production",
    queryKey: "PROCESS"
})