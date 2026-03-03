import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.tsx";
import type {IBatch} from "@features/panels/production/batches/api/IBatch.ts";

export const batchApi = createPanelApi<IBatch>({
    baseEndpoint: "/batch",
    queryKey: "BATCH"
});