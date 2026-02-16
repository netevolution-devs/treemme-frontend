import QUERY_KEY_STRINGS from "@api/QueryKeyStrings.ts";
import useApi from "@api/useApi.ts";
import {useMutation} from "@tanstack/react-query";
import type {IApiUserRolePayload} from "../model/UserInterfaces.ts";

const usePostUserRole = () => {
    const {post} = useApi();

    async function doPostUserRole(data: IApiUserRolePayload): Promise<unknown> {
        const url = `/user/role`;
        return await post(url, data as never);
    }

    return useMutation({
        mutationKey: [QUERY_KEY_STRINGS.ROLE.CREATE],
        mutationFn: doPostUserRole,
    });
};

export default usePostUserRole;