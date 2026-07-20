import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory";
import type {IBatchData} from "@features/panels/production/batches/batch-data/api/IBatchData";
import type {IBatchDataForm} from "@features/panels/production/batches/batch-data/BatchDataForm";
import {useMutation} from "@tanstack/react-query";
import {useTranslation} from "react-i18next";

export type IBatchDataPayload = IBatchDataForm;

export const batchDataApi = {
    ...createPanelApi<IBatchData, IBatchDataPayload>({
        baseEndpoint: "/batch-data",
        queryKey: "BATCH-DATA",

    }),
    useGetBatchDataPdf: () => {
        const {i18n} = useTranslation();
        return useMutation({
            mutationFn: async (id: number) => {
                window.open(`${import.meta.env.VITE_API}/batch/${id}/batch-data/pdf?lang=${i18n.language || 'it'}`, "_blank");
            },
            mutationKey: ["BATCH-DATA-PDF-PRINT"],
        });
    }
}