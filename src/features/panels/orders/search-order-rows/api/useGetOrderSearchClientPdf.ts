import { useMutation } from "@tanstack/react-query";
import useApi from "@api/useApi";

interface IClientOrderRowSummaryPrintParams {
    start_date?: string;
    end_date?: string;
    client_id?: number;
    shipping_status?: "to_ship" | "shipped",
    production_status?: "to_produce" | "produced",
    print_status?: "to_print" | "printed",
}

interface IMutateParams {
    params: IClientOrderRowSummaryPrintParams;
}

const useGetClientOrderRowSummaryPrint = () => {
    const { get } = useApi();

    return useMutation({
        mutationFn: async ({ params }: IMutateParams) => {
            const endpoint = `/client/client-order-row-summary-print`;

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

export default useGetClientOrderRowSummaryPrint;