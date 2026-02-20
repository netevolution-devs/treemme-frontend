import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useApi from "@api/useApi.ts";

interface ApiConfig {
    baseEndpoint: string;
    queryKey: string;
}

export const createPanelApi = <T, TPayload = Omit<T, 'id'>>(config: ApiConfig) => {
    const { baseEndpoint, queryKey } = config;

    return {
        // 1. GET LIST
        useGetList: () => {
            const { get } = useApi();
            return useQuery({
                queryKey: [queryKey, 'LIST'],
                queryFn: async () => {
                    const response = await get<T[]>(baseEndpoint);
                    return response.data.data;
                },
                staleTime: Infinity,
                gcTime: Infinity,
            });
        },

        // 2. GET DETAIL
        useGetDetail: (id?: number | null) => {
            const { get } = useApi();
            return useQuery({
                queryKey: [queryKey, 'DETAIL', id],
                queryFn: async () => {
                    const response = await get<T>(`${baseEndpoint}/${id}`);
                    return response.data.data;
                },
                enabled: !!id,
                staleTime: 0,
            });
        },

        // 3. POST (CREATE)
        usePost: () => {
            const { postEncoded: post } = useApi();
            const queryClient = useQueryClient();
            return useMutation({
                mutationKey: [queryKey, 'CREATE'],
                mutationFn: async (payload: TPayload) => {
                    const response = await post(baseEndpoint, payload!);
                    return response.data.data;
                },
                onSuccess: () => queryClient.invalidateQueries({ queryKey: [queryKey, 'LIST'] })
            });
        },

        // 4. PUT (UPDATE)
        usePut: () => {
            const { put } = useApi();
            const queryClient = useQueryClient();
            return useMutation({
                mutationKey: [queryKey, 'UPDATE'],
                mutationFn: async ({ id, payload }: { id: number; payload: TPayload }) => {
                    const response = await put(`${baseEndpoint}/${id}`, payload);
                    return response.data.data;
                },
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: [queryKey, 'LIST'] });
                    queryClient.invalidateQueries({ queryKey: [queryKey, 'DETAIL'] });
                }
            });
        },

        // 5. DELETE
        useDelete: () => {
            const { DELETE } = useApi();
            const queryClient = useQueryClient();
            return useMutation({
                mutationKey: [queryKey, 'DELETE'],
                mutationFn: async (id: number) => {
                    const response = await DELETE(`${baseEndpoint}/${id}`);
                    return response.data;
                },
                onSuccess: () => queryClient.invalidateQueries({ queryKey: [queryKey, 'LIST'] })
            });
        }
    };
};