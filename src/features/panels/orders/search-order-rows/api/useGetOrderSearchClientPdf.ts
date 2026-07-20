import {useMutation} from "@tanstack/react-query";
import {useTranslation} from "react-i18next";

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
    const {i18n} = useTranslation();

    return useMutation({
        mutationFn: async ({params}: IMutateParams) => {
            const queryParams = new URLSearchParams();
            queryParams.append('lang', i18n.language || 'it');
            if (params) {
                Object.entries(params).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && value !== '') {
                        queryParams.append(key, String(value));
                    }
                });
            }
            window.open(`${import.meta.env.VITE_API}/client/client-order-row-summary-print?${queryParams.toString()}`, "_blank");
        },
        mutationKey: ["CLIENT-ORDER-ROW-SUMMARY-PRINT"],
    });
}

export default useGetClientOrderRowSummaryPrint;
