import {useMutation} from "@tanstack/react-query";
import {useTranslation} from "react-i18next";

export interface IProductionToSendParams {
    start_date?: string | undefined;
    end_date?: string | undefined;
}

interface IMutateParams {
    params?: IProductionToSendParams;
}

const useGetProductionToSendPdf = () => {
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
            window.open(`${import.meta.env.VITE_API}/client-order/shipping-schedule/pdf?${queryParams.toString()}`, "_blank");
        },
        mutationKey: ["PRODUCTION-TO-SEND-PDF"],
    });
}

export default useGetProductionToSendPdf;
