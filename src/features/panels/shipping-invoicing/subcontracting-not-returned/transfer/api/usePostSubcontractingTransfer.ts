import { useMutation, useQueryClient } from "@tanstack/react-query";
import useApi from "@api/useApi";

interface ISubcontractingTransferPayload {
    ddtRowId: number;
    subcontractor_id: number;
    date: string;
    pieces: number;
    note: string;
    processing_id: number | null;
    ddt_number: string;
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
                processing_id: payload.processing_id,
                ddt_number: payload.ddt_number,
            } as never);
            return response.data.data;
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['DDT-ROW-NOT-RETURNED', 'LIST'] });
        },
    });
};

export default usePostSubcontractingTransfer;
