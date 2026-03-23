export interface ICurrencyChange {
    id: number;
    date: string;
    change_value: number;
}

export interface ICurrency {
    id: number;
    abbreviation: string;
    name: string;
    sign: string;
    last_change: ICurrencyChange | null;
}