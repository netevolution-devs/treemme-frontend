import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory";
import type {IUserManagement, IUserManagementPayload} from "@features/panels/user-management/users/api/IUserManagement.ts";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import useApi from "@api/useApi";

export interface IUserGroupAccess {
    id: number;
    group: { id: number; name: string } | [];
    role: { id: number; name: string } | [];
    work_area: { id: number; name?: string } | [];
    can_get: boolean;
    can_post: boolean;
    can_put: boolean;
    can_delete: boolean;
    check_order: boolean;
}

const GROUP_ACCESS_QUERY_KEY = "USER_GROUP_ACCESS";

export const usersApi = createPanelApi<IUserManagement, IUserManagementPayload>({
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

export const useGetGroupAccessList = () => {
    const {get} = useApi();
    return useQuery({
        queryKey: [GROUP_ACCESS_QUERY_KEY, "LIST"],
        queryFn: async () => {
            const response = await get<IUserGroupAccess[]>("/group-role-work-area");
            return response.data.data;
        },
        staleTime: 0,
    });
};

export const useUpdateGroupAccess = () => {
    const {put} = useApi();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({id, field, value}: { id: number; field: string; value: boolean }) => {
            const response = await put(`/group-role-work-area/${id}`, {[field]: value});
            return response.data.data;
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({queryKey: [GROUP_ACCESS_QUERY_KEY, "LIST"]});
        },
    });
};

export const useDeleteGroupAccess = () => {
    const {DELETE} = useApi();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            const response = await DELETE(`/api/user/remove-group/${id}`);
            return response.data;
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({queryKey: [GROUP_ACCESS_QUERY_KEY, "LIST"]});
        },
    });
};

export const useUpdateGroupAccessForm = () => {
    const {put} = useApi();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({id, group_id, role_id, work_area_id}: { id: number; group_id: number; role_id: number; work_area_id: number }) => {
            const response = await put(`/group-role-work-area/${id}`, {group_id, role_id, work_area_id});
            return response.data.data;
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({queryKey: [GROUP_ACCESS_QUERY_KEY, "LIST"]});
        },
    });
};

export const useUpdateGroupAccessInWorkArea = (workAreaId: number) => {
    const {put} = useApi();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({id, field, value}: { id: number; field: string; value: boolean }) => {
            const response = await put(`/group-role-work-area/${id}`, {[field]: value});
            return response.data.data;
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({queryKey: [GROUP_ACCESS_QUERY_KEY, "LIST"]});
            void queryClient.invalidateQueries({queryKey: ["WORK_AREA_MANAGEMENT", "DETAIL", workAreaId]});
        },
    });
};

export const useDeleteGroupAccessForWorkArea = (workAreaId: number) => {
    const {DELETE} = useApi();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            const response = await DELETE(`/api/user/remove-group/${id}`);
            return response.data;
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({queryKey: [GROUP_ACCESS_QUERY_KEY, "LIST"]});
            void queryClient.invalidateQueries({queryKey: ["WORK_AREA_MANAGEMENT", "DETAIL", workAreaId]});
        },
    });
};

export const useAssignGroupAccessForWorkArea = (workAreaId: number) => {
    const {post} = useApi();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({group_id, role_id}: { group_id: number; role_id: number }) => {
            const response = await post("/api/user/assign-group", {group_id, role_id, work_area_id: workAreaId});
            return response.data.data;
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({queryKey: [GROUP_ACCESS_QUERY_KEY, "LIST"]});
            void queryClient.invalidateQueries({queryKey: ["WORK_AREA_MANAGEMENT", "DETAIL", workAreaId]});
        },
    });
};

export const useAssignGroupAccess = () => {
    const {post} = useApi();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({group_id, role_id, work_area_id}: { group_id: number; role_id: number; work_area_id: number }) => {
            const response = await post("/api/user/assign-group", {group_id, role_id, work_area_id});
            return response.data.data;
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({queryKey: [GROUP_ACCESS_QUERY_KEY, "LIST"]});
        },
    });
};

export const useRemoveGroup = () => {
    const {DELETE} = useApi();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({userId, groupId}: { userId: number; groupId: number }) => {
            const response = await DELETE(`/api/user/remove-user/${userId}/${groupId}`);
            return response.data;
        },
        onSuccess: (_, {userId}) => {
            void queryClient.invalidateQueries({queryKey: ["USER_MANAGEMENT", "DETAIL", userId]});
        }
    });
};
