import { useMutation, useQueryClient } from "@tanstack/react-query";
import useApi from "@api/useApi.ts";
import type {
    IBatchCompositionForm
} from "@features/panels/production/batches/composition/BatchCompositionFormDialog.tsx";

type ICompositionPayload = Omit<IBatchCompositionForm, 'father_batch_id'>;
const usePostBatchComposition = (batchId: number) => {
    const { postEncoded: post } = useApi();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['BATCH-COMPOSITION', batchId],
        mutationFn: async (payload: ICompositionPayload) => {
            const response = await post<ICompositionPayload>(`/batch-composition`, {
                batch_id: batchId,
                ...payload
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