import { useMutation, useQueryClient } from "@tanstack/react-query";
import useApi from "@api/useApi.ts";

interface ISubcontractingReturnPayload {
    ddtRowId: number;
}

const usePostSubcontractingReturn = () => {
    const { postEncoded: post } = useApi();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['DDT-ROW-RETURN'],
        mutationFn: async (payload: ISubcontractingReturnPayload) => {
            const response = await post<unknown>(`/ddt-row/${payload.ddtRowId}/return`, {});
            return response.data.data;
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['DDT-ROW-NOT-RETURNED', 'LIST'] });
        },
    });
};

export default usePostSubcontractingReturn;