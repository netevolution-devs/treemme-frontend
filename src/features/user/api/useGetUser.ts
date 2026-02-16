import {useQuery, type UseQueryResult} from "@tanstack/react-query";
import useApi from "@api/useApi.ts";
import QUERY_KEY_STRINGS from "@api/QueryKeyStrings.ts";
import {type IApiUserProfile, type IUserProfile, UserProfileAdapter} from "@features/profile/model/IUserProfile.ts";

const useGetUser = (userCode: string): UseQueryResult<IUserProfile> => {
    const {get} = useApi();

    async function getUser(): Promise<IUserProfile> {
        const response = await get<IApiUserProfile>(`/user/${userCode}`);
        const apiProfile = response.data.data as IApiUserProfile;
        return UserProfileAdapter(apiProfile)
    }

    return useQuery({
        queryKey: [QUERY_KEY_STRINGS.USER.DETAIL, userCode],
        queryFn: getUser,
        staleTime: 1000 * 60,
        retry: false,
        enabled: userCode !== ""
    });
};

export default useGetUser;
