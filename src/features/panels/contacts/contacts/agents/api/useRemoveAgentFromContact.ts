import { useMutation, useQueryClient } from "@tanstack/react-query";
import useApi from "@api/useApi";

interface IAddAgentToContactPayload {
    agent_id: number;
}

const useAddAgentToContact = (clientId: number) => {
    const { DELETE } = useApi();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['REMOVE-AGENT', clientId],
        mutationFn: async (payload: IAddAgentToContactPayload) => {
            const response = await DELETE<unknown>(`/contact/${clientId}/agent/${payload.agent_id}`, {});
            return response.data.data;
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['CONTACT', 'DETAIL', clientId] });
        },
    });
};

export default useAddAgentToContact;