import { useMutation } from "@tanstack/react-query";
import useApi from "@api/useApi";

interface IDDTRowSoldClientParams {
    start_date?: string;
    end_date?: string;
}

interface IMutateParams {
    params: IDDTRowSoldClientParams;
}

const useGetDDTRowSoldClientPdf = () => {
    const { get } = useApi();

    return useMutation({
        mutationFn: async ({ params }: IMutateParams) => {
            const endpoint = `/ddt-row/sold/pdf`;

            const response = await get<Blob>(endpoint, {
                params,
                responseType: "blob",
            });

            const blob = new Blob([response.data as unknown as BlobPart], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);
            window.open(url, "_blank");

            return url;
        },
        mutationKey: ["CLIENT-ORDER-ROW-SUMMARY-PRINT"],
    });
}

export default useGetDDTRowSoldClientPdf;