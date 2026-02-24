import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useApi from "@api/useApi.ts";

interface ApiConfig {
    baseEndpoint: string;
    queryKey: string;
}

export interface ApiOptions {
    queryParams?: Record<string, string | number>;
    staleTime?: number;
    invalidateQueries?: string[];
}

export const createPanelApi = <T, TPayload = Omit<T, 'id'>>(config: ApiConfig) => {
    const { baseEndpoint, queryKey } = config;

    return {
        // GET LIST
        useGetList: (options?: ApiOptions) => {
            const { get } = useApi();
            return useQuery({
                queryKey: [queryKey, 'LIST', options?.queryParams],
                queryFn: async () => {
                    const response = await get<T[]>(baseEndpoint, { params: options?.queryParams });
                    return response.data.data;
                },
                staleTime: options?.staleTime || Infinity,
                gcTime: Infinity,
            });
        },

        // GET DETAIL
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

        // POST (CREATE)
        usePost: (options?: ApiOptions) => {
            const { postEncoded: post } = useApi();
            const queryClient = useQueryClient();
            return useMutation({
                mutationKey: [queryKey, 'CREATE'],
                mutationFn: async (payload: TPayload) => {
                    const response = await post(baseEndpoint, payload!);
                    return response.data.data;
                },
                onSuccess: () => {
                    // Invalida la lista corrente
                    queryClient.invalidateQueries({ queryKey: [queryKey, 'LIST'] });

                    // Invalida query extra se fornite
                    options?.invalidateQueries?.forEach(key => {
                        queryClient.invalidateQueries({ queryKey: [key] });
                    });
                }
            });
        },

        // PUT (UPDATE)
        usePut: (options?: ApiOptions) => {
            const { put } = useApi();
            const queryClient = useQueryClient();
            return useMutation({
                mutationKey: [queryKey, 'UPDATE'],
                mutationFn: async ({ id, payload }: { id: number; payload: TPayload }) => {
                    const response = await put(`${baseEndpoint}/${id}`, payload);
                    return response.data.data;
                },
                onSuccess: (_, variables) => {
                    queryClient.invalidateQueries({ queryKey: [queryKey, 'LIST'] });
                    queryClient.invalidateQueries({ queryKey: [queryKey, 'DETAIL', variables.id] });

                    options?.invalidateQueries?.forEach(key => {
                        queryClient.invalidateQueries({ queryKey: [key] });
                    });
                }
            });
        },

        // DELETE
        useDelete: (options?: ApiOptions) => {
            const { DELETE } = useApi();
            const queryClient = useQueryClient();
            return useMutation({
                mutationKey: [queryKey, 'DELETE'],
                mutationFn: async (id: number) => {
                    const response = await DELETE(`${baseEndpoint}/${id}`);
                    return response.data;
                },
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: [queryKey, 'LIST'] });

                    options?.invalidateQueries?.forEach(key => {
                        queryClient.invalidateQueries({ queryKey: [key] });
                    });
                }
            });
        }
    };
};