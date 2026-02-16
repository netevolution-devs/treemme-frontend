import {useMutation, useQueryClient} from "@tanstack/react-query";
import useApi from "@api/useApi.ts";
import QUERY_KEY_STRINGS from "@api/QueryKeyStrings.ts";

interface IVerifyDevice {
    userCode: string;
    otpCode: string;
}

interface IVerifyResponse {
    message: string;
    enabled: boolean;
}

const usePostVerifyDevice = () => {
    const {post} = useApi()
    const queryClient = useQueryClient();

    async function doPostLogin(data: IVerifyDevice): Promise<IVerifyResponse> {
        const response = await post<{ code: string }, IVerifyResponse>(`/api/totp/verify/${data.userCode}`, {
          code: data.otpCode
        });
        return response.data as unknown as IVerifyResponse;
    }

    return useMutation({
        mutationKey: [QUERY_KEY_STRINGS.USER.VERIFY_DEVICE],
        mutationFn: doPostLogin,
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: [QUERY_KEY_STRINGS.USER.WHOAMI]});
        },
    });
};

export default usePostVerifyDevice;
