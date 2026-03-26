import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.tsx";
import type {IRoleManagement, IRoleManagementPayload} from "@features/panels/user-management/api/IRoleManagement.ts";

export const roleManagementApi = createPanelApi<IRoleManagement, IRoleManagementPayload>({
    baseEndpoint: "/role",
    queryKey: "ROLE_MANAGEMENT"
});
