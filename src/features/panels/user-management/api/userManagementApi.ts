import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.tsx";
import type {IUserManagement, IUserManagementPayload} from "@features/panels/user-management/api/IUserManagement.ts";

export const userManagementApi = createPanelApi<IUserManagement, IUserManagementPayload>({
    baseEndpoint: "/api/user",
    queryKey: "USER_MANAGEMENT"
});
