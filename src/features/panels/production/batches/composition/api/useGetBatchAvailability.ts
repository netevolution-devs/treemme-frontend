import {useQuery} from "@tanstack/react-query";
import useApi from "@api/useApi.ts";
import type {IBatch} from "@features/panels/production/batches/api/IBatch.ts";

const useGetBatchAvailability = (tfBatchId: number) => {
    const { get } = useApi();
    return useQuery({
        queryKey: ['BATCH-AVAILABILITY', tfBatchId],
        queryFn: async () => {

            const response = await get<IBatch[]>(`/batch/availability`);
            return response.data.data;
        },
        enabled: !!tfBatchId,
        staleTime: 0,
        gcTime: 0
    });
};

export default useGetBatchAvailability;