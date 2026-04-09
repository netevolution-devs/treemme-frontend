import { useMutation, useQueryClient } from "@tanstack/react-query";
import useApi from "@api/useApi";

interface IRefinementPayload {
    quantity: number;
    scheduled_date: string;
    client_order_row_id: number;
}

const useBatchRefinement = (clientOrderRowId: number) => {
    const { postEncoded: post } = useApi();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['BATCH-REFINEMENT'],
        mutationFn: async (payload: IRefinementPayload) => {
            const response = await post<IRefinementPayload>(`/batch/refinement`, payload as never);
            return response.data.data;
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['CLIENT-ORDER-ROW', 'LIST'] });
            void queryClient.invalidateQueries({ queryKey: ['CLIENT-ORDER-ROW', 'DETAIL', clientOrderRowId] });
            void queryClient.invalidateQueries({ queryKey: ['BATCH', 'LIST'] });
        },
    });
};

export default useBatchRefinement;