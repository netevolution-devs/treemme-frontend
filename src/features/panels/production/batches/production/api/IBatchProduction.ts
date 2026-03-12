import type {IMachine} from "@features/panels/production/machinery/api/IMachine.ts";

export interface IBatchProduction {
    machine: IMachine;
    production_note: string;
    scheduled_date: string;
}