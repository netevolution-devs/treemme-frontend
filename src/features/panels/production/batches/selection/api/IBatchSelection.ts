import type {ISelection} from "@features/panels/shared/api/selection/ISelection.ts";

export interface IBatchSelection {
    id: number;
    pieces: number;
    quantity: number;
    stock_pieces: number;
    stock_quantity: number;
    selection: ISelection;
}