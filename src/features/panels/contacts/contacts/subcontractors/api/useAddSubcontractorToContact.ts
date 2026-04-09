import { useMutation, useQueryClient } from "@tanstack/react-query";
import useApi from "@api/useApi";

interface IAddSubcontractorToContactPayload {
    subcontractor_id: number;
}

const useAddSubcontractorToContact = (clientId: number) => {
    const { postEncoded: post } = useApi();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['ADD-SUBCONTRACTOR', clientId],
        mutationFn: async (payload: IAddSubcontractorToContactPayload) => {
            const response = await post<unknown>(`/contact/${clientId}/subcontractor/${payload.subcontractor_id}`, {});
            return response.data.data;
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['CONTACT', 'DETAIL', clientId] });
        },
    });
};

export default useAddSubcontractorToContact;
