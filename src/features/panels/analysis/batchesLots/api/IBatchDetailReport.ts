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

export interface IBatchDetailReportObj {
    total_pieces: number;
    total_quantity: number;
    total_quantity_ftsq: number;
    sold_pieces: number;
    sold_quantity: number;
    sold_quantity_ftsq: number;
    available_pieces: number;
    available_quantity: number;
    available_quantity_ftsq: number;
    sale_price_per_leather: number;
    total_sale_price: number;
    total_revenue: number;
    average_revenue_per_leather: number;
    average_ftsq_per_leather: number;
    total_costs: number;
    sq_ft_average_expected: number;
    sq_ft_average_found: number;
    sq_ft_average_diff: number;
    cost_per_piece_euro_mq: number;
    cost_per_piece_lire_pq: number;
    revenue_per_piece_euro_mq: number;
    revenue_per_piece_lire_pq: number;
    sc_sale_revenue_euro_mq: number;
    sc_sale_revenue_lire_pq: number;
    compensation_waste: number;
    flower_total_revenue: number;
    flower_total_revenue_lire: number;
    flower_cost_euro_mq: number;
    flower_cost_lire_pq: number;
}

export interface IBatchDetailReport {
    id: number;
    code: string;
    report: IBatchDetailReportObj;
    costs: ICostBatchDetailReport[];
    sales: ISaleBatchDetailReport[];
}