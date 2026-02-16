import {useQuery, type UseQueryResult} from "@tanstack/react-query";
import useApi from "../../../shared/api/useApi";
import QUERY_KEY_STRINGS from "../../../shared/api/QueryKeyStrings";
import {type IApiUser, type IUser, UserAdapter} from "@features/user/model/UserInterfaces.ts";

const useGetWhoAmI = (): UseQueryResult<IUser> => {
    const {get} = useApi()

    async function whoAmI(): Promise<IUser> {
        const response = await get<IApiUser>(`/api/whoami`);
        const apiUser = response.data.data as IApiUser;
        return UserAdapter(apiUser);
    }

    return useQuery({
        queryKey: [QUERY_KEY_STRINGS.USER.WHOAMI],
        queryFn: whoAmI,
        staleTime: 1000 * 60,
        retry: false,
    });
};

export default useGetWhoAmI;
