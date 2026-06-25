import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory";
import type {IBatchComposition} from "@features/panels/production/batches/composition/api/IBatchComposition";

export interface IBatchCompositionPayload {
    batch_id: number;
    father_batch_id: number;
    batch_selection_id: number;
    father_batch_piece: number;
    date: string;
    composition_note?: string;
}

export const batchCompositionApi = createPanelApi<IBatchComposition, IBatchCompositionPayload>({
    baseEndpoint: "/batch-composition",
    queryKey: "BATCH-COMPOSITION"
});
