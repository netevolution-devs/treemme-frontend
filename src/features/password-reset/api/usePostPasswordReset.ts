import {useMutation} from "@tanstack/react-query";
import QUERY_KEY_STRINGS from "@api/QueryKeyStrings";
import useApi from "@api/useApi";

interface PasswordResetData {
    email: string;
}

interface PasswordResetResponse {
    message: string;
}

const usePostPasswordReset = () => {
    const {postEncoded} = useApi();
    const doReset = async (data: PasswordResetData): Promise<PasswordResetResponse>  => {
        const url = "/user/password/reset";
        const response = await postEncoded(url, {...data});

        return response.data as unknown as PasswordResetResponse;
    }

    return useMutation({
        mutationKey: [QUERY_KEY_STRINGS.USER.RESET_PASSWORD_REQUEST_CODE],
        mutationFn: doReset
    });
}

export default usePostPasswordReset;
