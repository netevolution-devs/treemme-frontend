import type {ISelection} from "@features/panels/products/selection/api/ISelection.ts";
import type {IBatch} from "@features/panels/production/batches/api/IBatch.ts";
import type {IThickness} from "@features/panels/leathers/thicknesses/api/IThickness.ts";

export interface ISelectionStock {
    id: number;
    name: string;
    available_pieces: number;
}

export interface ISelectionStockBatch {
    id: number;
    batch: IBatch;
    selection: ISelection;
    pieces: number;
    quantity: number;
    stock_quantity: number;
    thickness: IThickness;
    note: string | null;
}