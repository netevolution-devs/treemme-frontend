import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.tsx";
import type {IBatch} from "@features/panels/production/batches/api/IBatch.ts";

export interface IBatchesPayload extends Omit<IBatch, 'id'
    | 'leather'
    | 'batch_type'
    | 'measurement_unit'
    | 'check_user'
> {
    leather_id: number;
    batch_type_id: number;
    measurement_unit_id: number;
}

export const batchApi = createPanelApi<IBatch, IBatchesPayload>({
    baseEndpoint: "/batch",
    queryKey: "BATCH"
});