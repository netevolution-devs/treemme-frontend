import {useQuery} from "@tanstack/react-query";
import useApi from "@api/useApi.ts";
import type {IBatch} from "@features/panels/production/batches/api/IBatch.ts";

const useGetBatchSplitAvailability = () => {
    const { get } = useApi();
    return useQuery({
        queryKey: ['BATCH-AVAILABILITY', 'LIST'],
        queryFn: async () => {

            const response = await get<IBatch[]>(`/batch/available`);
            return response.data.data;
        },
        staleTime: 0,
        gcTime: 0
    });
};

export default useGetBatchSplitAvailability;