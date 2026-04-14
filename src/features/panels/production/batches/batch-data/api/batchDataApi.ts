import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory";
import type {IBatchData} from "@features/panels/production/batches/batch-data/api/IBatchData";
import type {IBatchDataForm} from "@features/panels/production/batches/batch-data/BatchDataForm";

export type IBatchDataPayload = IBatchDataForm;

export const batchDataApi = createPanelApi<IBatchData, IBatchDataPayload>({
    baseEndpoint: "/batch-data",
    queryKey: "BATCH-DATA",
});