import type {IWorkAreaManagement, IWorkAreaManagementPayload} from "@features/panels/user-management/api/IWorkAreaManagement.ts";
import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.ts";

export const workAreaManagementApi = createPanelApi<IWorkAreaManagement, IWorkAreaManagementPayload>({
    baseEndpoint: "/work/area",
    queryKey: "WORK_AREA_MANAGEMENT"
});
