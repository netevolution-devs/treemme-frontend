import { useMutation } from "@tanstack/react-query";
import useApi from "@api/useApi";

const useGetProductionReportPdf = () => {
    const { get } = useApi();

    return useMutation({
        mutationFn: async () => {
            const endpoint = `/client-order/production-report/pdf`;

            const response = await get<Blob>(endpoint, {
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
