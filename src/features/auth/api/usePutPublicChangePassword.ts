import {useMutation} from "@tanstack/react-query";
import useApi from "@api/useApi";
import QUERY_KEY_STRINGS from "@api/QueryKeyStrings";

interface IPublicChangePassword {
    user_code: string;
    old_password: string;
    new_password: string;
}

interface IPublicChangePasswordResponse {
    message: string;
}

const usePutPublicChangePassword = () => {
    const {put} = useApi()

    async function doPutPublicChangePassword(data: IPublicChangePassword): Promise<IPublicChangePasswordResponse> {
        const response = await put<IPublicChangePassword, IPublicChangePasswordResponse>('/api/public/change-password', data);
        return response.data as unknown as IPublicChangePasswordResponse;
    }

    return useMutation({
        mutationKey: [QUERY_KEY_STRINGS.USER.CHANGE_PASSWORD],
        mutationFn: doPutPublicChangePassword,
    });
};

export default usePutPublicChangePassword;