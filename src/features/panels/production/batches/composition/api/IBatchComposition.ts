import type {IBatch} from "@features/panels/production/batches/api/IBatch";
import type {IThickness} from "@features/panels/leathers/thicknesses/api/IThickness";

// export interface IBatchComposition {
//     id: number;
//     father_batch: IBatch;
//     father_batch_id: number;
//     father_batch_quantity: number | null;
//     composition_note: string;
// }

export interface IBatchComposition {
    id: number;
    batch: IBatch;
    father_batch: IBatch;
    father_batch_piece: number;
    father_batch_quantity: number;
    composition_note: string;
    date: string;
    thickness: IThickness | null;
}