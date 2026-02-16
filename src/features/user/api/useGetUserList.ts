import { useQuery } from "@tanstack/react-query";
import QUERY_KEY_STRINGS from "@api/QueryKeyStrings.ts";
import useApi from "@shared/api/useApi";
import {type IApiUser, type IUser, UserArrayAdapter} from "@features/user/model/UserInterfaces.ts";

type UserType = "backoffice" | "auditor" | "all";

interface UseGetUserListOptions {
  type?: UserType;
  enabled?: boolean;
}

const useGetUserList = (options?: UseGetUserListOptions) => {
  const { get } = useApi();
  const type = options?.type || "all";
  const enabled = options?.enabled ?? true;
  
  const url = type === "all" ? `/backoffice/user/all` : `/backoffice/user/all?type=${type}`;

  async function doGetUserList(): Promise<IUser[]> {
    const response = await get<IApiUser[]>(url);
    return UserArrayAdapter(response.data.data);
  }

  return useQuery({
    queryKey: [QUERY_KEY_STRINGS.USER.LIST, type],
    queryFn: doGetUserList,
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export default useGetUserList;