import type {IMachine} from "@features/panels/production/machinery/api/IMachine";

export interface IBatchProduction {
    id: number;
    machine: IMachine;
    production_note: string;
    scheduled_date: string;
}