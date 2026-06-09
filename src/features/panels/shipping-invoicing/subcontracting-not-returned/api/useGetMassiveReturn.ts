import { useMutation, useQueryClient } from "@tanstack/react-query";
import useApi from "@api/useApi";

interface IMassiveReturnPayload {
    rows: { id: number }[];
}

const useGetMassiveReturn = () => {
    const { post } = useApi();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['DDT-ROW-MASSIVE-RETURN'],
        mutationFn: async (payload: IMassiveReturnPayload) => {
            const formData = new FormData();
            payload.rows.forEach((row, index) => {
                formData.append(`rows[${index}][id]`, row.id.toString());
            });
            const response = await post<FormData, unknown>(`/ddt-row/massive-return`, formData);
            return response.data.data;
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['DDT-ROW-NOT-RETURNED', 'LIST'] });
        },
    });
};

export default useGetMassiveReturn;
