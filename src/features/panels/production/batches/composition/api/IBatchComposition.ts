import type {IBatch} from "@features/panels/production/batches/api/IBatch";
import type {IThickness} from "@features/panels/leathers/thicknesses/api/IThickness";
import type {IBatchSelection} from "@features/panels/production/batches/selection/api/IBatchSelection";

export interface IBatchComposition {
    id: number;
    batch: IBatch;
    father_batch: IBatch;
    father_batch_piece: number;
    father_batch_quantity: number;
    batch_selection: IBatchSelection;
    composition_note: string;
    date: string;
    thickness: IThickness | null;
}