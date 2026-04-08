import { useMutation, useQueryClient } from "@tanstack/react-query";
import useApi from "@api/useApi";

interface IReworkPayload {
    pieces: number;
}

const usePostBatchRework = (batchId: number, batchCode: string) => {
    const { postEncoded: post } = useApi();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['BATCH-REWORK', batchCode],
        mutationFn: async (payload: IReworkPayload) => {
            if (!batchCode) throw new Error("Batch Code is required for rework");

            const response = await post<IReworkPayload>(`/batch/rework/${batchCode}`, payload as never);
            return response.data.data;
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['BATCH', 'LIST'] });
            void queryClient.invalidateQueries({ queryKey: ['BATCH', 'DETAIL', batchId] });
        },
    });
};

export default usePostBatchRework;