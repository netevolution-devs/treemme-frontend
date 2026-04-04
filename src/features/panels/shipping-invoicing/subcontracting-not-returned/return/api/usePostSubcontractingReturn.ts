import { useMutation, useQueryClient } from "@tanstack/react-query";
import useApi from "@api/useApi.ts";

interface ISubcontractingReturnPayload {
    ddtRowId: number;
    date: string;
    pieces: number;
    note: string;
}

const usePostSubcontractingReturn = (batchId: number) => {
    const { postEncoded: post } = useApi();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['DDT-ROW-RETURN'],
        mutationFn: async (payload: ISubcontractingReturnPayload) => {
            const response = await post<unknown>(`/ddt-row/${payload.ddtRowId}/return`, {
                date: payload.date,
                pieces: payload.pieces,
                row_note: payload.note,
            } as never);
            return response.data.data;
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['DDT-ROW-NOT-RETURNED', 'LIST'] });
            void queryClient.invalidateQueries({ queryKey: ['BATCH', 'DETAIL', batchId] });
        },
    });
};

export default usePostSubcontractingReturn;