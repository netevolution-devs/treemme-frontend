import type {IBatch} from "@features/panels/production/batches/api/IBatch.ts";
import type {IMachine} from "@features/panels/production/machinery/api/IMachine.ts";

export interface IProcess {
    id: number;
    batch: Pick<IBatch, 'id'
        | 'checked'
        | 'batch_type'
        | 'batch_code'
        | 'pieces'
        | 'quantity'
    >;
    machine: IMachine;
    production_note: string;
    scheduled_date: string;
}