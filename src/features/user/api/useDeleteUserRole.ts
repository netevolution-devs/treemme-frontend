import QUERY_KEY_STRINGS from "@api/QueryKeyStrings";
import useApi from "@api/useApi";
import {useMutation} from "@tanstack/react-query";

const useDeleteUserRole = () => {
    const { DELETE } = useApi();

    async function doDeleteUserRole(roleAssociationId: number): Promise<unknown> {
        const url = `/user/role/${roleAssociationId}`;
        return await DELETE(url);
    }

    return useMutation({
        mutationKey: [QUERY_KEY_STRINGS.ROLE.DELETE],
        mutationFn: doDeleteUserRole,
    });
};

export default useDeleteUserRole;

