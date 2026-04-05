import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.ts";
import type {IGroupManagement, IGroupManagementPayload} from "@features/panels/user-management/api/IGroupManagement.ts";

export const groupManagementApi = createPanelApi<IGroupManagement, IGroupManagementPayload>({
    baseEndpoint: "/group",
    queryKey: "GROUP_MANAGEMENT"
});
