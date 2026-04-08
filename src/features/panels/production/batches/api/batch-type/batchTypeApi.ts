import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory";
import type {IBatchType} from "@features/panels/production/batches/api/batch-type/IBatchType";

export const batchTypeApi = createPanelApi<IBatchType>({
    baseEndpoint: "/batch-type",
    queryKey: "BATCH-TYPE"
});