import { useMutation } from "@tanstack/react-query";
import useApi from "@api/useApi";

interface IDDTNotReturnedPrintParams {
    start_date?: string;
    end_date?: string;
    subcontractor_id?: number;
}

interface IMutateParams {
    params?: IDDTNotReturnedPrintParams;
}

const useGetDDTNotReturnedPrint = () => {
    const { get } = useApi();

    return useMutation({
        mutationFn: async ({ params }: IMutateParams) => {
            const endpoint = `/ddt-row/external-processing/pdf`;

            const response = await get<Blob>(endpoint, {
                params,
                responseType: "blob",
            });

            const blob = new Blob([response.data as unknown as BlobPart], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);
            window.open(url, "_blank");

            return url;
        },
        mutationKey: ["DDT-ROW-NOT-RETURNED-PRINT"],
    });
}

export default useGetDDTNotReturnedPrint;
