import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory";
import type {IBatchData} from "@features/panels/production/batches/batch-data/api/IBatchData";
import type {IBatchDataForm} from "@features/panels/production/batches/batch-data/BatchDataForm";
import useApi from "@api/useApi";

export type IBatchDataPayload = IBatchDataForm;

export const batchDataApi = {
    ...createPanelApi<IBatchData, IBatchDataPayload>({
        baseEndpoint: "/batch-data",
        queryKey: "BATCH-DATA",

    }),
    useGetBatchDataPdf: () => {
        const {get} = useApi();
        return async (id: number) => {
            const endpoint = `/batch/${id}/batch-data/pdf`;
            const response = await get<Blob>(endpoint, {
                responseType: "blob",
            });
            const blob = new Blob([response.data as unknown as BlobPart], {type: "application/pdf"});
            const url = window.URL.createObjectURL(blob);
            window.open(url, "_blank");
        };
    }
}