import {useMutation, useQueryClient} from "@tanstack/react-query";
import useApi from "../../../shared/api/useApi";
import QUERY_KEY_STRINGS from "../../../shared/api/QueryKeyStrings";

interface ILoginData {
    email: string;
    password: string;
}

interface ILoginResponse {
    refresh_token?: string,
    error?: string;
    user_code?: string;
    requires_totp?: boolean;
}

const usePostLogin = () => {
    const {post} = useApi()
    const queryClient = useQueryClient();

    async function doPostLogin(data: ILoginData): Promise<ILoginResponse> {
        const response = await post<ILoginData, ILoginResponse>('/login', data);
        return response.data as ILoginResponse;
    }

    return useMutation({
        mutationKey: [QUERY_KEY_STRINGS.USER.LOGIN],
        mutationFn: doPostLogin,
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: [QUERY_KEY_STRINGS.USER.WHOAMI]});
        },
    });
};

export default usePostLogin;
