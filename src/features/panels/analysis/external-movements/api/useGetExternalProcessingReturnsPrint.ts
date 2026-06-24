import { useMutation } from "@tanstack/react-query";
import useApi from "@api/useApi";

interface IExternalProcessingReturnsPrintParams {
    start_date?: string;
    end_date?: string;
    subcontractor_id?: number;
}

interface IMutateParams {
    params?: IExternalProcessingReturnsPrintParams;
}

const useGetExternalProcessingReturnsPrint = () => {
    const { get } = useApi();

    return useMutation({
        mutationFn: async ({ params }: IMutateParams) => {
            const endpoint = `/ddt-row/external-processing-returns/pdf`;

            const response = await get<Blob>(endpoint, {
                params,
                responseType: "blob",
            });

            const blob = new Blob([response.data as unknown as BlobPart], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);
            window.open(url, "_blank");

            return url;
        },
        mutationKey: ["EXTERNAL-PROCESSING-RETURNS-PRINT"],
    });
}

export default useGetExternalProcessingReturnsPrint;
