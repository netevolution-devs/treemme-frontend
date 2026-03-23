import { useMutation, useQueryClient } from "@tanstack/react-query";
import useApi from "@api/useApi.ts";

interface IAddAgentToContactPayload {
    agent_id: number;
}

const useAddAgentToContact = (clientId: number) => {
    const { postEncoded: post } = useApi();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['ADD-AGENT', clientId],
        mutationFn: async (payload: IAddAgentToContactPayload) => {
            const response = await post<unknown>(`/contact/${clientId}/agent/${payload.agent_id}`, {});
            return response.data.data;
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['CONTACT', 'DETAIL', clientId] });
        },
    });
};

export default useAddAgentToContact;