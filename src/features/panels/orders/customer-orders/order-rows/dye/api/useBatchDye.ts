import { useMutation, useQueryClient } from "@tanstack/react-query";
import useApi from "@api/useApi.ts";

interface IDyePayload {
    quantity: number;
    scheduled_date: string;
    machine_id: number;
    client_order_row_id: number;
}

const usePostBatchDye = () => {
    const { postEncoded: post } = useApi();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['BATCH-DYE'],
        mutationFn: async (payload: IDyePayload) => {
            const response = await post<IDyePayload>(`/batch/dye`, payload as never);
            return response.data.data;
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['BATCH', 'LIST'] });
        },
    });
};

export default usePostBatchDye;