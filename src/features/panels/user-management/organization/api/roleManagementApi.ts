import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory";
import type {IRoleManagement, IRoleManagementPayload} from "@features/panels/user-management/organization/api/IRoleManagement";

export const roleManagementApi = createPanelApi<IRoleManagement, IRoleManagementPayload>({
    baseEndpoint: "/role",
    queryKey: "ROLE_MANAGEMENT"
});
