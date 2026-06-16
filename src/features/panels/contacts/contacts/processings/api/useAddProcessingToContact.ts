import { useMutation, useQueryClient } from "@tanstack/react-query";
import useApi from "@api/useApi";

export interface IAddProcessingToContactPayload {
    processing_id: number;
}

const useAddProcessingToContact = (contactId: number) => {
    const { postEncoded: post } = useApi();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['ADD-PROCESSING', contactId],
        mutationFn: async (payload: IAddProcessingToContactPayload) => {
            const response = await post<unknown>(`/contact/${contactId}/processing/${payload.processing_id}`, {});
            return response.data.data;
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['CONTACT', 'DETAIL', contactId] });
        },
    });
};

export default useAddProcessingToContact;
