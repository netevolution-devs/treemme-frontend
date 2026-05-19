export interface IMovementBatchDetailReport {
    date: string;
    reason: string;
    contact: string;
    pieces: number;
    quantity: number;
    note: string;
}

export interface ICostBatchDetailReport {
    id: string | number;
    date: string;
    type: string;
    amount: number;
    currency: string;
    note: string | null;
}

export interface ISaleBatchDetailReport {
    id: string | number;
    ddt_number: string;
    ddt_date: string;
    client: string;
    pieces: number;
    quantity: number;
    total_value: number;
    note: string | null;
}

export interface ICalculatedStockBatchDetailReport {
    total_revenue: number;
    total_cost: number;
    current_stock_pieces: number;
    current_stock_quantity: number;
}

export interface IBatchDetailReport {
    id: number;
    code: string;
    date: string;
    type: string;
    pieces: number;
    quantity: number;
    um: string;
    leather: string;
    article: string | null;
    movements: IMovementBatchDetailReport[];
    costs: ICostBatchDetailReport[];
    sales: ISaleBatchDetailReport[];
    orders: unknown[];
    productions: unknown[];
    selections: unknown[];
    calculated: ICalculatedStockBatchDetailReport;
    children: IBatchDetailReport[];
}