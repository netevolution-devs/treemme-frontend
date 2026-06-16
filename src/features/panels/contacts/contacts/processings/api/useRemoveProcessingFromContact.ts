import { useMutation, useQueryClient } from "@tanstack/react-query";
import useApi from "@api/useApi";

interface IRemoveProcessingFromContactPayload {
    processing_id: number;
}

const useRemoveProcessingFromContact = (contactId: number) => {
    const { DELETE } = useApi();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['REMOVE-PROCESSING', contactId],
        mutationFn: async (payload: IRemoveProcessingFromContactPayload) => {
            const response = await DELETE<unknown>(`/contact/${contactId}/processing/${payload.processing_id}`, {});
            return response.data.data;
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['CONTACT', 'DETAIL', contactId] });
        },
    });
};

export default useRemoveProcessingFromContact;
