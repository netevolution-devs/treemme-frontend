import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.tsx";
import type {IWorkAreaManagement, IWorkAreaManagementPayload} from "@features/panels/user-management/api/IWorkAreaManagement.ts";

export const workAreaManagementApi = createPanelApi<IWorkAreaManagement, IWorkAreaManagementPayload>({
    baseEndpoint: "/work/area",
    queryKey: "WORK_AREA_MANAGEMENT"
});
