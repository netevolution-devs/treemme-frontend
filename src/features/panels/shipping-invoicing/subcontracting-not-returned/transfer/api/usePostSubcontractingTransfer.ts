import { useMutation, useQueryClient } from "@tanstack/react-query";
import useApi from "@api/useApi.ts";

interface ISubcontractingTransferPayload {
    ddtRowId: number;
    subcontractor_id: number;
    date: string;
    pieces: number;
    note: string;
}

const usePostSubcontractingTransfer = () => {
    const { postEncoded: post } = useApi();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['DDT-ROW-TRANSFER'],
        mutationFn: async (payload: ISubcontractingTransferPayload) => {
            const response = await post<unknown>(`/ddt-row/${payload.ddtRowId}/transfer`, {
                subcontractor_id: payload.subcontractor_id,
                date: payload.date,
                pieces: payload.pieces,
                row_note: payload.note,
            } as never);
            return response.data.data;
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['DDT-ROW-NOT-RETURNED', 'LIST'] });
        },
    });
};

export default usePostSubcontractingTransfer;
