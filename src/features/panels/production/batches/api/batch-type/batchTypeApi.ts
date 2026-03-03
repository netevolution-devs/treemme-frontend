import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.tsx";
import type {IBatchType} from "@features/panels/production/batches/api/batch-type/IBatchType.ts";

export const batchTypeApi = createPanelApi<IBatchType>({
    baseEndpoint: "/batch-type",
    queryKey: "BATCH-TYPE"
});