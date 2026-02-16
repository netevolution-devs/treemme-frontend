import {useMutation} from "@tanstack/react-query";
import QUERY_KEY_STRINGS from "@api/QueryKeyStrings.ts";
import useApi from "@api/useApi.ts";

interface PasswordResetChangeData {
    new_password: string;
    reset_token: string;
}

interface PasswordResetChangeResponse {
    message: string;
}

const usePostPasswordResetChange = () => {
    const {postEncoded} = useApi();
    const doChange = async (data: PasswordResetChangeData): Promise<PasswordResetChangeResponse>  => {
        const url = "/user/password/reset/change";
        const response = await postEncoded(url, {...data});

        return response.data as unknown as PasswordResetChangeResponse;
    }

    return useMutation({
        mutationKey: [QUERY_KEY_STRINGS.USER.RESET_PASSWORD_UPDATE],
        mutationFn: doChange
    });
}

export default usePostPasswordResetChange;
