export interface IWeeklyOrderTotals {
    rows_count: number;
    total_amount: number;
    total_quantity_mq: number;
    total_quantity_pq: number;
    avg_price_mq: number;
    avg_price_pq: number;
}

export interface IWeeklyOrderAverage extends IWeeklyOrderTotals {
    leather_type: {
        id: number;
        name: string;
        code: string | null;
    } | null;
    currency: {
        id: number;
        name: string;
        abbreviation: string | null;
        sign: string | null;
    } | null;
    total_currency_amount: number;
}

export interface IWeeklyOrderAverageRow extends IWeeklyOrderAverage {
    id: string;
}

export interface IWeeklyOrderAveragesResponse {
    items: IWeeklyOrderAverage[];
    summary: IWeeklyOrderTotals;
    start_date: string | null;
    end_date: string | null;
    internal: boolean | null;
}
