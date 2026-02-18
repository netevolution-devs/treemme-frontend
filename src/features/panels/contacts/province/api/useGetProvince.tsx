import type {IProvince} from "@features/panels/contacts/province/api/IProvince.ts";
import useApi from "@api/useApi.ts";
import {useQuery} from "@tanstack/react-query";
import {PROVINCE_QUERY_KEYS} from "@features/panels/contacts/province/api/PROVINCE_QUERY_KEYS.ts";

const useGetProvince = (id?: number | null) => {
    const {get} = useApi();

    const url = `/province/${id}`;

    async function doGet(): Promise<IProvince> {
        const response = await get<IProvince>(url);
        return response.data.data;
    }

    return useQuery({
        queryKey: [PROVINCE_QUERY_KEYS.DETAIL, id],
        queryFn: doGet,
        staleTime: Infinity,
        gcTime: Infinity,
        retry: false,
        enabled: !!id
    })
}

export default useGetProvince;