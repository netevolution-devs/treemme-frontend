import { useMutation } from "@tanstack/react-query";
import useApi from "@api/useApi";

export interface IProductionReportParams {
    start_date?: string | undefined;
    end_date?: string | undefined;
    print_status?: "to_print" | "printed" | undefined;
}

interface IMutateParams {
    params?: IProductionReportParams;
}

const useGetProductionReportPdf = () => {
    const { get } = useApi();

    return useMutation({
        mutationFn: async ({ params }: IMutateParams) => {
            const endpoint = `/client-order/production-report/pdf`;

            const response = await get<Blob>(endpoint, {
                params,
                responseType: "blob",
            });

            const blob = new Blob([response.data as unknown as BlobPart], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);
            window.open(url, "_blank");

            return url;
        },
        mutationKey: ["PRODUCTION-REPORT-PDF"],
    });
}

export default useGetProductionReportPdf;
