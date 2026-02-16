import {useMutation} from "@tanstack/react-query";
import QUERY_KEY_STRINGS from "@api/QueryKeyStrings.ts";
import useApi from "@api/useApi.ts";

interface PasswordResetVerifyData {
    verification_code: string;
}

interface PasswordResetVerifyResponse {
    status?: "ok" | "ko";
    message: string;
    reset_token?: string;
}

const usePasswordResetVerify = () => {
    const {postEncoded} = useApi();
    const doVerify = async (data: PasswordResetVerifyData): Promise<PasswordResetVerifyResponse[]>  => {
        const url = "/user/password/reset/verify";
        const response = await postEncoded(url, {...data});

        return response.data as unknown as PasswordResetVerifyResponse[];
    }

    return useMutation({
        mutationKey: [QUERY_KEY_STRINGS.USER.RESET_PASSWORD_VERIFY_CODE],
        mutationFn: doVerify
    });
}

export default usePasswordResetVerify;
