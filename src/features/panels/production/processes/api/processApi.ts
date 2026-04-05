import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory";
import type {IProcess} from "@features/panels/production/processes/api/IProcess";

export const processApi = createPanelApi<IProcess>({
    baseEndpoint: "/production",
    queryKey: "PROCESS"
})