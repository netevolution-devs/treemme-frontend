import {useMutation} from "@tanstack/react-query";
import {useTranslation} from "react-i18next";

export interface IProductionReportParams {
    start_date?: string | undefined;
    end_date?: string | undefined;
    print_status?: "to_print" | "printed" | undefined;
}

interface IMutateParams {
    params?: IProductionReportParams;
}

const useGetProductionReportPdf = () => {
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
            window.open(`${import.meta.env.VITE_API}/client-order/production-report/pdf?${queryParams.toString()}`, "_blank");
        },
        mutationKey: ["PRODUCTION-REPORT-PDF"],
    });
}

export default useGetProductionReportPdf;
