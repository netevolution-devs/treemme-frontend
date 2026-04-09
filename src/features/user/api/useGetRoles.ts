import {useQuery, type UseQueryResult} from "@tanstack/react-query";
import useApi from "@api/useApi";
import QUERY_KEY_STRINGS from "@api/QueryKeyStrings";
import type {IRole} from "@features/user/model/RoleInterfaces";

const useGetRoles = (): UseQueryResult<IRole[]> => {
    const {get} = useApi();

    const url = `/role`

    async function getRole(): Promise<IRole[]> {
        const response = await get<IRole[]>(url);
        return response.data.data as IRole[];
    }

    return useQuery({
        queryKey: [QUERY_KEY_STRINGS.ROLE.LIST],
        queryFn: getRole,
        staleTime: 0,
        retry: false,
    });
};

export default useGetRoles;
