import {useMutation} from "@tanstack/react-query";
import {useTranslation} from "react-i18next";

interface IDDTNotReturnedPrintParams {
    start_date?: string;
    end_date?: string;
    subcontractor_id?: number;
}

interface IMutateParams {
    params?: IDDTNotReturnedPrintParams;
}

const useGetDDTNotReturnedPrint = () => {
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
            window.open(`${import.meta.env.VITE_API}/ddt-row/external-processing/pdf?${queryParams.toString()}`, "_blank");
        },
        mutationKey: ["DDT-ROW-NOT-RETURNED-PRINT"],
    });
}

export default useGetDDTNotReturnedPrint;
