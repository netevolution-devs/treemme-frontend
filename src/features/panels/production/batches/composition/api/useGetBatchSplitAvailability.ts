import {useQuery} from "@tanstack/react-query";
import useApi from "@api/useApi";
import type {IBatch} from "@features/panels/production/batches/api/IBatch";

const useGetBatchSplitAvailability = () => {
    const { get } = useApi();
    return useQuery({
        queryKey: ['BATCH-SPLIT-AVAILABILITY', 'LIST'],
        queryFn: async () => {

            const response = await get<IBatch[]>(`/batch/split/available`);
            return response.data.data;
        },
        staleTime: 0,
        gcTime: 0
    });
};

export default useGetBatchSplitAvailability;