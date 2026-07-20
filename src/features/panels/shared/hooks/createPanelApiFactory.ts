import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import useApi from "@api/useApi";
import {useTranslation} from "react-i18next";
import axios from "axios";

const exportAxiosInstance = axios.create({withCredentials: true});

interface ApiConfig {
    baseEndpoint: string;
    queryKey: string;
}

export interface ApiOptions {
    queryParams?: Record<string, string | number>;
    staleTime?: number;
    invalidateQueries?: string[];
}

export const useExportCSV = (
    baseEndpoint: string,
    queryParams?: Record<string, string | number>,
    fileName?: string,
    mutationKey?: string
) => {
    const {i18n} = useTranslation();
    const endpoint = import.meta.env.VITE_API;

    return useMutation({
        mutationFn: async () => {
            const params: Record<string, string> = {};
            params.lang = i18n.language || 'it';
            params.export = 'csv';

            if (queryParams) {
                Object.entries(queryParams).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && value !== '') {
                        params[key] = String(value);
                    }
                });
            }

            const response = await exportAxiosInstance.get(endpoint + baseEndpoint, {
                params,
                responseType: 'blob',
            });

            const blob = new Blob([response.data as BlobPart], {
                type: 'text/csv;charset=utf-8;',
            });

            const currentDate = new Date().toISOString().split('T')[0];
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.setAttribute('download', fileName ? `${fileName}_${currentDate}` : 'export.csv');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        },
        mutationKey: mutationKey ? [mutationKey, 'EXPORT'] : ['EXPORT-CSV', baseEndpoint],
    });
};

export const createPanelApi = <T, TPayload = Omit<T, 'id'>>(config: ApiConfig) => {
    const {baseEndpoint, queryKey} = config;

    return {
        queryKey,
        // GET LIST
        useGetList: (options?: ApiOptions) => {
            const {get} = useApi();
            const extraKeys = options?.invalidateQueries ? [{extra: options?.invalidateQueries}] : [];
            const queryKeys = options?.queryParams ? [options.queryParams] : [];

            return useQuery({
                queryKey: [queryKey, 'LIST', ...extraKeys, ...queryKeys],
                queryFn: async () => {
                    const response = await get<T[]>(baseEndpoint, {params: options?.queryParams});
                    return response.data.data;
                },
                staleTime: options?.staleTime || Infinity,
                gcTime: Infinity,
            });
        },

        // GET DETAIL
        useGetDetail: (id?: number | null) => {
            const {get} = useApi();
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
            const {postEncoded: post} = useApi();
            const queryClient = useQueryClient();
            return useMutation({
                mutationKey: [queryKey, 'CREATE'],
                mutationFn: async (payload: TPayload) => {
                    const response = await post(baseEndpoint, payload!);
                    return response.data.data;
                },
                onSuccess: () => {
                    void queryClient.invalidateQueries({queryKey: [queryKey, 'LIST']});

                    options?.invalidateQueries?.forEach(key => {
                        void queryClient.invalidateQueries({queryKey: [key]});
                    });
                }
            });
        },

        // PUT (UPDATE)
        usePut: (options?: ApiOptions) => {
            const {put} = useApi();
            const queryClient = useQueryClient();
            return useMutation({
                mutationKey: [queryKey, 'UPDATE'],
                mutationFn: async ({id, payload}: { id: number; payload: Partial<TPayload> }) => {
                    const response = await put(`${baseEndpoint}/${id}`, payload);
                    return response.data.data;
                },
                onSuccess: (_, variables) => {
                    void queryClient.invalidateQueries({queryKey: [queryKey, 'LIST']});
                    void queryClient.invalidateQueries({queryKey: [queryKey, 'DETAIL', variables.id]});

                    options?.invalidateQueries?.forEach(key => {
                        void queryClient.invalidateQueries({queryKey: [key]});
                    });
                }
            });
        },

        // EXPORT CSV
        useExport: (queryParams?: Record<string, string | number>) => {
            return useExportCSV(baseEndpoint, queryParams, `${queryKey}-export.csv`, queryKey);
        },

        // DELETE
        useDelete: (options?: ApiOptions) => {
            const {DELETE} = useApi();
            const queryClient = useQueryClient();
            return useMutation({
                mutationKey: [queryKey, 'DELETE'],
                mutationFn: async (id: number) => {
                    const response = await DELETE(`${baseEndpoint}/${id}`);
                    return response.data;
                },
                onSuccess: () => {
                    void queryClient.invalidateQueries({queryKey: [queryKey, 'LIST']});

                    options?.invalidateQueries?.forEach(key => {
                        void queryClient.invalidateQueries({queryKey: [key]});
                    });
                }
            });
        }
    };
};