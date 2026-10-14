import {useQuery} from "@tanstack/react-query";
import useApi from "@api/useApi";
import type {IGenericApiResponse} from "@api/interfaces/IGenericApiResponse";
import type {ApiOptions} from "@features/panels/shared/hooks/createPanelApiFactory";
import type {IWeeklyOrderAveragesResponse} from "./IWeeklyOrderAverage";

const unwrapResponse = (
    response: IWeeklyOrderAveragesResponse | IGenericApiResponse<IWeeklyOrderAveragesResponse>,
): IWeeklyOrderAveragesResponse => "items" in response ? response : response.data;

const useGetWeeklyOrderAverages = (options?: ApiOptions) => {
    const {get} = useApi();

    return useQuery({
        queryKey: ["ORDER-ROW-WEEKLY-AVERAGES", "LIST", options?.queryParams],
        queryFn: async () => {
            const response = await get<IWeeklyOrderAveragesResponse>(
                "/client-order-row/weekly-averages",
                {params: options?.queryParams},
            );
            return unwrapResponse(response.data);
        },
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
    });
};

export default useGetWeeklyOrderAverages;
