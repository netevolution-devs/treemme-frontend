import type {IProvince} from "@features/panels/contacts/province/api/IProvince.ts";
import useApi from "@api/useApi.ts";
import {useQuery} from "@tanstack/react-query";

const useGetListProvince = () => {
    const {get} = useApi();

    const url = `/province`;

    async function doGet(): Promise<IProvince[]> {
        const response = await get<IProvince[]>(url);
        return response.data.data;
    }

    return useQuery({
        queryKey: [url],
        queryFn: doGet,
        staleTime: Infinity,
        gcTime: Infinity,
        retry: false,
    })
}

export default useGetListProvince;