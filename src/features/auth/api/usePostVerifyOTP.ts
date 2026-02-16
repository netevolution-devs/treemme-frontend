import {useMutation, useQueryClient} from "@tanstack/react-query";
import useApi from "../../../shared/api/useApi";
import QUERY_KEY_STRINGS from "../../../shared/api/QueryKeyStrings";

interface ILoginOTPData {
    user_code: string;
    totp_code: string;
}

interface IVerifyResponse {
    refresh_token?: string,
}

const usePostVerifyOTP = () => {
    const {post} = useApi()
    const queryClient = useQueryClient();

    async function doPostLogin(data: ILoginOTPData): Promise<IVerifyResponse> {
        const response = await post<ILoginOTPData, IVerifyResponse>('/verify-totp', data);
        return response.data as IVerifyResponse;
    }

    return useMutation({
        mutationKey: [QUERY_KEY_STRINGS.USER.LOGIN_OTP],
        mutationFn: doPostLogin,
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: [QUERY_KEY_STRINGS.USER.WHOAMI]});
        },
    });
};

export default usePostVerifyOTP;
