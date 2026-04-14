import {useQuery} from "@tanstack/react-query";
import useApi from "@api/useApi";

const useGetSubcontractorPdf = (id: string) => {
    const {get} = useApi();

    return useQuery({
        queryKey: ['BATCH', 'SUBCONTRACTOR-PDF', id],
        queryFn: async () => {
            const response = await get(`/batch/${id}/subcontractor-pdf?full=1`, {responseType: 'blob'});
            return response.data as unknown as Blob;
        },
        enabled: !!id,
        staleTime: 0,
        gcTime: 0,
    });
};

export default useGetSubcontractorPdf;
