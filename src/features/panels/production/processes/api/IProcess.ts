import type {IBatch} from "@features/panels/production/batches/api/IBatch";
import type {IMachine} from "@features/panels/production/machinery/api/IMachine";

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