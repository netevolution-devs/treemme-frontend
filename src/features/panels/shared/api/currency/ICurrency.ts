export interface ICurrency {
    id: number;
    abbreviation: string;
    name: string;
    sign: string;
    last_change: {
        id: number;
        date: string;
        change_value: number;
    } | null;
}