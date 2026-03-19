import { useMutation, useQueryClient } from "@tanstack/react-query";
import useApi from "@api/useApi.ts";

interface ICompositionPayload {
    pieces: number;
    // quantity: number;
    note?: string;
}

const usePostBatchComposition = (batchId: number) => {
    const { postEncoded: post } = useApi();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['BATCH-COMPOSITION', batchId],
        mutationFn: async (payload: ICompositionPayload & { father_batch_id: number }) => {
            if (!batchId && !payload.father_batch_id) throw new Error("Batch Code is required for rework");

            const response = await post<ICompositionPayload>(`/batch-composition`, {
                father_batch_piece: payload.pieces,
                // father_batch_quantity: payload.quantity,
                batch_id: batchId,
                father_batch_id: payload.father_batch_id,
                composition_note: payload.note ?? '',
            } as never);
            return response.data.data;
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['BATCH', 'LIST'] });
            void queryClient.invalidateQueries({ queryKey: ['BATCH', 'DETAIL', batchId] });
        },
    });
};

export default usePostBatchComposition;