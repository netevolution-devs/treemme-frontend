import { useMutation, useQueryClient } from "@tanstack/react-query";
import useApi from "@api/useApi.ts";

interface IRefinementPayload {
    quantity: number;
    scheduled_date: string;
    client_order_row_id: number;
}

const useBatchRefinement = () => {
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
        },
    });
};

export default useBatchRefinement;