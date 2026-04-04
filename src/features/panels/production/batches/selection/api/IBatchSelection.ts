import type {ISelection} from "@features/panels/products/selection/api/ISelection.ts";
import type {IThickness} from "@features/panels/leathers/thicknesses/api/IThickness.ts";

export interface IBatchSelection {
    id: number;
    pieces: number;
    quantity: number;
    stock_pieces: number;
    stock_quantity: number;
    selection: ISelection;
    thickness: IThickness;
    note: string;
}