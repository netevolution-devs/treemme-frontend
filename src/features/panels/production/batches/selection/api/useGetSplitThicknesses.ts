import { useQuery } from "@tanstack/react-query";
import useApi from "@api/useApi";
import type { IThickness } from "@features/panels/leathers/thicknesses/api/IThickness";

const useGetSplitThicknesses = (batchId: number) => {
    const { get } = useApi();

    return useQuery({
        queryKey: ['BATCH-AVAILABLE-THICKNESSES', batchId],
        queryFn: async () => {
            if (!batchId) return [];

            const response = await get<IThickness[]>(`/batch/${batchId}/available-thicknesses`);
            return response.data.data;
        },
        enabled: !!batchId,
    });
};

export default useGetSplitThicknesses;
