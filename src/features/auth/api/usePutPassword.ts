import {useMutation, useQueryClient} from "@tanstack/react-query";
import useApi from "@api/useApi";
import QUERY_KEY_STRINGS from "@api/QueryKeyStrings";

interface IChangePassword {
  password: string;
  signed_information: boolean;
  signed_appointment_head: boolean;
}

interface IChangePasswordResponse {
    refresh_token?: string,
}

const usePutPassword = () => {
    const {put} = useApi()
    const queryClient = useQueryClient();

    async function doPutPassword(data: IChangePassword): Promise<IChangePasswordResponse> {
        const response = await put<IChangePassword, IChangePasswordResponse>('/user/first/change/password', data);
        return response.data as IChangePasswordResponse;
    }

    return useMutation({
        mutationKey: [QUERY_KEY_STRINGS.USER.CHANGE_PASSWORD],
        mutationFn: doPutPassword,
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: [QUERY_KEY_STRINGS.USER.WHOAMI]});
        },
    });
};

export default usePutPassword;
