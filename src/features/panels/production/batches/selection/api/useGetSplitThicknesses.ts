import { useQuery } from "@tanstack/react-query";
import useApi from "@api/useApi";
import type { IThickness } from "@features/panels/leathers/thicknesses/api/IThickness";

export interface IThicknessAvailable {
    total_pieces: number;
    thickness: IThickness;
}

const useGetSplitThicknesses = (batchId: number) => {
    const { get } = useApi();

    return useQuery({
        queryKey: ['BATCH-AVAILABLE-THICKNESSES', batchId],
        queryFn: async () => {
            if (!batchId) return [];

            const response = await get<IThicknessAvailable[]>(`/batch/${batchId}/available-thicknesses`);
            return response.data.data;
        },
        enabled: !!batchId,
    });
};

export default useGetSplitThicknesses;
