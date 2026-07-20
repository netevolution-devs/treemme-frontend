import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory";
import type {IProcess} from "@features/panels/production/processes/api/IProcess";
import {useMutation} from "@tanstack/react-query";
import {useTranslation} from "react-i18next";

export const processApi = {
    ...createPanelApi<IProcess>({
        baseEndpoint: "/production",
        queryKey: "PROCESS"
    }),
    useGetDailyPrint: () => {
        const {i18n} = useTranslation();
        return useMutation({
            mutationKey: ["DAILY-PRINT-PDF-PRINT"],
            mutationFn: async (date: string) => {
                window.open(`${import.meta.env.VITE_API}/production/daily-print?lang=${i18n.language || 'it'}&date=${date}`, "_blank");
            }
        })
    },
}