import { useMutation, useQueryClient } from "@tanstack/react-query";
import useApi from "@api/useApi";

interface ISplitPayload {
    batch_id: number;
    selection_id: number;
    pieces: number;
}

const useBatchSelection = () => {
    const { postEncoded: post } = useApi();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['BATCH-SELECTION'],
        mutationFn: async (payload: ISplitPayload) => {
            const response = await post<ISplitPayload>(`/batch_selection`, payload as never);
            return response.data.data;
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['BATCH', 'LIST'] });
        },
    });
};

export default useBatchSelection;