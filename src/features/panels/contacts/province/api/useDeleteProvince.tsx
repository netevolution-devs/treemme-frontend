import useApi from "@api/useApi.ts";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {PROVINCE_QUERY_KEYS} from "@features/panels/contacts/province/api/PROVINCE_QUERY_KEYS.ts";

const useDeleteProvince = () => {
    const {DELETE} = useApi();
    const queryClient = useQueryClient();

    async function doDelete(id: number): Promise<unknown> {
        const url = `/province/${id}`;
        const response = await DELETE(url);
        return response.data;
    }

    return useMutation({
        mutationKey: [PROVINCE_QUERY_KEYS.DELETE],
        mutationFn: doDelete,
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: [PROVINCE_QUERY_KEYS.LIST]});
        }
    })
};

export default useDeleteProvince;
