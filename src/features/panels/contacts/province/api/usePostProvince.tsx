import useApi from "@api/useApi.ts";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import type {IProvince} from "@features/panels/contacts/province/api/IProvince.ts";
import {PROVINCE_QUERY_KEYS} from "@features/panels/contacts/province/api/PROVINCE_QUERY_KEYS.ts";

type IProvincePayload = Omit<IProvince, 'id'>;

const usePostProvince = () => {
    const {postEncoded: post} = useApi();
    const queryClient = useQueryClient();

    const url = `/province`;

    async function doPost(payload: IProvincePayload): Promise<unknown> {
        const response = await post(url, payload);
        return response.data.data;
    }

    return useMutation({
        mutationKey: [PROVINCE_QUERY_KEYS.POST],
        mutationFn: doPost,
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: [PROVINCE_QUERY_KEYS.LIST]});
        }
    })
};

export default usePostProvince;