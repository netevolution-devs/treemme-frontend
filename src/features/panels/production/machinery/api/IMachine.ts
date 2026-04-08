import type {IBatchType} from "@features/panels/production/batches/api/batch-type/IBatchType";

export interface IMachine {
    id: number;
    batch_type: IBatchType;
    prefix: string | null;
    name: string;
}