import type {IBatch} from "@features/panels/production/batches/api/IBatch";
import type {ICurrency} from "@features/panels/shared/api/currency/ICurrency";

export interface IBatchCostType {
    id: number;
    name: string;
    description: string | null;
}

export interface IBatchCost {
    id: number;
    batch: IBatch;
    batch_cost_type: IBatchCostType;
    date: string;
    cost: number;
    currency: ICurrency;
    currency_cost: number | null;
    currency_exchange: number;
    cost_note: string | null;
}
