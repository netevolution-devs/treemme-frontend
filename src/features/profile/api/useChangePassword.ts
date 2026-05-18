import {useMutation} from "@tanstack/react-query";
import useApi from "@api/useApi";
import QUERY_KEY_STRINGS from "@api/QueryKeyStrings";

interface IChangePassword {
    old_password: string;
    new_password: string;
}

interface IChangePasswordResponse {
    message: string;
}

const useChangePassword = () => {
    const {put} = useApi()

    async function doPostChangePassword(data: IChangePassword): Promise<IChangePasswordResponse> {
        const response = await put<IChangePassword, IChangePasswordResponse>(`/api/change-password`, data);
        return response.data as unknown as IChangePasswordResponse;
    }

    return useMutation({
        mutationKey: [QUERY_KEY_STRINGS.USER.CHANGE_PASSWORD],
        mutationFn: doPostChangePassword,
    });
};

export default useChangePassword;
