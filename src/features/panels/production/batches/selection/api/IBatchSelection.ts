import type {ISelection} from "@features/panels/products/selection/api/ISelection.ts";

export interface IBatchSelection {
    id: number;
    pieces: number;
    quantity: number;
    stock_pieces: number;
    stock_quantity: number;
    selection: ISelection;
}