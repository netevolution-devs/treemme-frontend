import {AxiosError} from "axios";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import useApi from "../../../shared/api/useApi";
import QUERY_KEY_STRINGS from "../../../shared/api/QueryKeyStrings";

const usePostLogout = () => {
    const {post} = useApi()
    const queryClient = useQueryClient();

    async function doPostLogout(): Promise<void> {
        await post<void, void>('/logout');
    }

    return useMutation<void, AxiosError, void>({
        mutationKey: [QUERY_KEY_STRINGS.USER.LOGOUT],
        mutationFn: doPostLogout,
        onSuccess: async () => {
            queryClient.clear();
        },
    });
};

export default usePostLogout;
