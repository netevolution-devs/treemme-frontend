import {createPanelApi, type ApiOptions} from "@features/panels/shared/hooks/createPanelApiFactory";
import type {IBatch} from "@features/panels/production/batches/api/IBatch";
import useApi from "@api/useApi";

import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import type {IBatchCost} from "@features/panels/production/batches/api/IBatchCost";
import type {IBatchDetailReport} from "@features/panels/analysis/batchesLots/api/IBatchDetailReport";

export interface IBatchesPayload extends Omit<IBatch, 'id'
    | 'leather'
    | 'batch_type'
    | 'measurement_unit'
    | 'check_user'
    | 'sq_ft_average_expected'
    | 'sq_ft_average_found'
    | 'stock_items'
    | 'stock_quantity'
    | 'batch_code'
> {
    leather_id: number;
    batch_type_id: number;
    measurement_unit_id: number;
}

interface IMutateParamsGetPdf {
    id: number;
    batchCode: string;
}

export interface IBatchPieceCompensationPayload {
    pieces: number;
    sign: "+" | "-";
    batch_selection_id?: number | null;
}

export const batchApi = {
    ...createPanelApi<IBatch, IBatchesPayload>({
        baseEndpoint: "/batch",
        queryKey: "BATCH"
    }),
    useGetBatchReport: (batch_id: number) => {
        const {get} = useApi();
        return useQuery({
            queryKey: ["BATCH", "REPORT", batch_id],
            queryFn: async () => {
                const response = await get(`/batch/${batch_id}/report`);
                return response.data.data as IBatchDetailReport;
            },
            enabled: !!batch_id,
        });
    },
    usePutBatchPieceCompensation: (options?: ApiOptions) => {
        const {put} = useApi();
        const queryClient = useQueryClient();
        return useMutation({
            mutationKey: ["BATCH", "COMPENSATION"],
            mutationFn: async ({id, payload}: { id: number; payload: IBatchPieceCompensationPayload }) => {
                const response = await put(`/batch/${id}/compensation`, payload);
                return response.data.data;
            },
            onSuccess: (_, variables) => {
                void queryClient.invalidateQueries({queryKey: ["BATCH", "DETAIL", variables.id]});
                options?.invalidateQueries?.forEach(key => {
                    void queryClient.invalidateQueries({queryKey: [key]});
                });
            }
        });
    },
    useGetPdf: () => {
        const {get} = useApi();
        return useMutation({
            mutationFn: async ({id, batchCode}: IMutateParamsGetPdf) => {
                const endpoint = batchCode.startsWith("TF")
                    ? `/batch/${id}/subcontractor-pdf`
                    : `/batch/${id}/pdf`;
                const response = await get<Blob>(endpoint, {
                    responseType: "blob",
                });
                const blob = new Blob([response.data as unknown as BlobPart], {type: "application/pdf"});
                const url = window.URL.createObjectURL(blob);
                window.open(url, "_blank");
                return url;
            },
            mutationKey: ["BATCH-PDF-PRINT"],
        });
    },
    useGetBatchCosts: (id?: number | null) => {
        const {get} = useApi();
        return useQuery({
            queryKey: ["BATCH", "COSTS", id],
            queryFn: async () => {
                const response = await get<IBatchCost[]>(`/batch/${id}/cost`);
                return response.data.data;
            },
            enabled: !!id,
            staleTime: 0,
        });
    },
    useCalculateHalfPieces: () => {
        const {post} = useApi();
        const queryClient = useQueryClient();
        return useMutation({
            mutationKey: ["BATCH", "CALCULATE-HALF-PIECES"],
            mutationFn: async (id: number) => {
                const response = await post(`/batch/${id}/calculate-half-pieces`);
                return response.data.data;
            },
            onSuccess: (_, id) => {
                void queryClient.invalidateQueries({queryKey: ["BATCH", "DETAIL", id]});
            }
        });
    },
};