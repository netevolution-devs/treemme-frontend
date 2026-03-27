import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.tsx";
import type {IUserManagement, IUserManagementPayload} from "@features/panels/user-management/api/IUserManagement.ts";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import useApi from "@api/useApi.ts";

export const userManagementApi = createPanelApi<IUserManagement, IUserManagementPayload>({
    baseEndpoint: "/api/user",
    queryKey: "USER_MANAGEMENT"
});

export const useAssignGroup = () => {
    const {post} = useApi();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({user_id, group_id}: { user_id: number; group_id: number }) => {
            const response = await post("/api/user/assign-user", {user_id, group_id});
            return response.data.data;
        },
        onSuccess: (_, {user_id}) => {
            void queryClient.invalidateQueries({queryKey: ["USER_MANAGEMENT", "DETAIL", user_id]});
        }
    });
};

export const useRemoveGroup = () => {
    const {DELETE} = useApi();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({groupId, userId}: { groupId: number; userId: number }) => {
            const response = await DELETE(`/api/user/remove-user/${groupId}`);
            return response.data;
        },
        onSuccess: (_, { userId }) => {
            void queryClient.invalidateQueries({queryKey: ["USER_MANAGEMENT", "DETAIL", userId]});
        }
    });
};
