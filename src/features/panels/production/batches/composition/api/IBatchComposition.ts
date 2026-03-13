import type {IBatch} from "@features/panels/production/batches/api/IBatch.ts";

export interface IBatchComposition {
    id: number;
    father_batch: IBatch;
    father_batch_id: number;
    father_batch_quantity: number | null;
    composition_note: string;
}

export interface IBatchCompositionResponse {
    id: number;
    father_batch_piece: number;
    father_batch_quantity: number;
    composition_note: string;
    father_batch: IBatch;
}