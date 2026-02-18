import useApi from "@api/useApi.ts";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {PROVINCE_QUERY_KEYS} from "@features/panels/contacts/province/api/PROVINCE_QUERY_KEYS.ts";
import type {IProvincePayload} from "@features/panels/contacts/province/api/usePostProvince.tsx";

type IProvinceUpdatePayload = {
    id: number;
    payload: IProvincePayload;
};

const usePostProvince = () => {
    const {put} = useApi();
    const queryClient = useQueryClient();


    async function doPost(payload: IProvinceUpdatePayload): Promise<unknown> {
        const url = `/province/${payload.id}`;

        const response = await put(url, payload.payload);
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