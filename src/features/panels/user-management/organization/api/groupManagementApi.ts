import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory";
import type {IGroupManagement, IGroupManagementPayload} from "@features/panels/user-management/organization/api/IGroupManagement";

export const groupManagementApi = createPanelApi<IGroupManagement, IGroupManagementPayload>({
    baseEndpoint: "/group",
    queryKey: "GROUP_MANAGEMENT"
});
