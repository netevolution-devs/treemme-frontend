import {useMutation, useQueryClient} from "@tanstack/react-query";
import useApi from "@api/useApi.ts";
import QUERY_KEY_STRINGS from "@api/QueryKeyStrings.ts";

interface ISetupOtp {
    userCode: string;
}

interface ISetupOtpResponse {
    message: string;
    qr_data: {
      secret: string;
      qr_url: string;
      manual_entry_key: string;
      issuer: string;
      account: string;
    },
    backup_codes: string[];
}

const usePostSetupOTP = () => {
    const {post} = useApi()
    const queryClient = useQueryClient();

    async function doPostSetupOTP(data: ISetupOtp): Promise<ISetupOtpResponse> {
        const response = await post<ISetupOtp, ISetupOtpResponse>(`/api/totp/setup/${data.userCode}`);
        return response.data as unknown as ISetupOtpResponse;
    }

    return useMutation({
        mutationKey: [QUERY_KEY_STRINGS.USER.LOGIN_OTP],
        mutationFn: doPostSetupOTP,
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: [QUERY_KEY_STRINGS.USER.WHOAMI]});
        },
    });
};

export default usePostSetupOTP;
