import {useQuery} from "@tanstack/react-query";
import useApi from "@api/useApi";
import type {ApiOptions} from "@features/panels/shared/hooks/createPanelApiFactory";
import type {IOrderRowsSearch} from "@features/panels/orders/search-order-rows/api/IOrderRowsSearch";

const useGetSearchOrderRows = (options?: ApiOptions) => {
    const { get } = useApi();
    return useQuery({
        queryKey: ['ORDER-ROWS-SEARCH', 'LIST', options?.queryParams],
        queryFn: async () => {

            const response = await get<IOrderRowsSearch[]>(
                `/client-order-row-report`,
                {params: options?.queryParams}
            );
            return response.data.data;
        },
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10
    });
};

export default useGetSearchOrderRows;