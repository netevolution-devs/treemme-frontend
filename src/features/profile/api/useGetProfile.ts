import {useQuery, useQueryClient, type UseQueryResult} from "@tanstack/react-query";
import useApi from "@api/useApi.ts";
import QUERY_KEY_STRINGS from "@api/QueryKeyStrings.ts";
import {type IUserProfile, mergeUserAndProfile} from "@features/profile/model/IUserProfile.ts";
import {type IApiProfile, ProfileAdapter} from "@features/profile/model/IProfile.ts";
import type {IUser} from "@features/user/model/UserInterfaces.ts";

const useGetProfile = (userCode: string): UseQueryResult<IUserProfile> => {
    const {get} = useApi();

    const queryClient = useQueryClient();
    const userData = queryClient.getQueryData([QUERY_KEY_STRINGS.USER.WHOAMI]);

    async function getProfile(): Promise<IUserProfile> {
        const response = await get<IApiProfile>(`/user/${userCode}`);
        const apiProfile = response.data.data as IApiProfile;
        return mergeUserAndProfile(userData as IUser, ProfileAdapter(apiProfile));
    }

    return useQuery({
        queryKey: [QUERY_KEY_STRINGS.USER.PROFILE],
        queryFn: getProfile,
        staleTime: 1000 * 60,
        retry: false,
        enabled: !!userCode,
    });
};

export default useGetProfile;
