import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory";
import type {IBatchCompositionResponse} from "@features/panels/production/batches/composition/api/IBatchComposition";

export interface IBatchCompositionPayload {
    batch_id: number;
    batch_selection_id: number;
    father_batch_piece: number;
    date: string;
    composition_note?: string;
}

export const batchCompositionApi = createPanelApi<IBatchCompositionResponse, IBatchCompositionPayload>({
    baseEndpoint: "/batch-composition",
    queryKey: "BATCH-COMPOSITION"
});
