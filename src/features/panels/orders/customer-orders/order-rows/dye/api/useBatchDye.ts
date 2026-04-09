import { useMutation, useQueryClient } from "@tanstack/react-query";
import useApi from "@api/useApi";
import dayjs from "dayjs";

interface IDyePayload {
    quantity: number;
    scheduled_date: string;
    machine_id: number;
    client_order_row_id: number;
}

const usePostBatchDye = (clientOrderRowId: number) => {
    const { postEncoded: post } = useApi();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['BATCH-DYE'],
        mutationFn: async (payload: IDyePayload) => {
            const response = await post<IDyePayload>(`/batch/dye`, payload as never);
            return response.data.data;
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['CLIENT-ORDER-ROW', 'LIST'] });
            void queryClient.invalidateQueries({ queryKey: ['CLIENT-ORDER-ROW', 'DETAIL', clientOrderRowId] });
            void queryClient.invalidateQueries({ queryKey: ['BATCH', 'LIST'] });
            void queryClient.invalidateQueries({ queryKey: ['PROCESS', 'LIST', { scheduled_date: dayjs().format('YYYY-MM-DD') }] });
        },
    });
};

export default usePostBatchDye;