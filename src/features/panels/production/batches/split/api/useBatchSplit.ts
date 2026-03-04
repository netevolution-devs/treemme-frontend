import { useMutation, useQueryClient } from "@tanstack/react-query";
import useApi from "@api/useApi.ts";

interface ISplitPayload {
    pieces: number;
}

const useBatchSplit = (batchId: number, batchCode: string) => {
    const { postEncoded: post } = useApi();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['BATCH-SPLIT', batchCode],
        mutationFn: async (payload: ISplitPayload) => {
            if (!batchCode) throw new Error("Batch Code is required for split");

            const response = await post<ISplitPayload>(`/batch/split/${batchCode}`, payload as never);
            return response.data.data;
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['BATCH', 'LIST'] });
            void queryClient.invalidateQueries({ queryKey: ['BATCH', 'DETAIL', batchId] });
        },
    });
};

export default useBatchSplit;