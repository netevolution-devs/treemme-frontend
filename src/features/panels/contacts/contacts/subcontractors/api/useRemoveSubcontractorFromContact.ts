import { useMutation, useQueryClient } from "@tanstack/react-query";
import useApi from "@api/useApi";

interface IRemoveSubcontractorFromContactPayload {
    subcontractor_id: number;
}

const useRemoveSubcontractorFromContact = (clientId: number) => {
    const { DELETE } = useApi();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['REMOVE-SUBCONTRACTOR', clientId],
        mutationFn: async (payload: IRemoveSubcontractorFromContactPayload) => {
            const response = await DELETE<unknown>(`/contact/${clientId}/subcontractor/${payload.subcontractor_id}`, {});
            return response.data.data;
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['CONTACT', 'DETAIL', clientId] });
        },
    });
};

export default useRemoveSubcontractorFromContact;
