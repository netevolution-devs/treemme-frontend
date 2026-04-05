import type {ICurrency} from "@features/panels/shared/api/currency/ICurrency";

export interface ICurrencyChange {
    id: number;
    currency: ICurrency;
    date: string;
    change_value: number;
}