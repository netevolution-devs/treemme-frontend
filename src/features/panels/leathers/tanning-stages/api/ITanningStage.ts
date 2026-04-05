import type {IMeasurementUnit} from "@features/panels/shared/api/measurement-unit/IMeasurementUnit";

export interface ITanningStage {
    id: number;
    name: string;
    code: string;
    flower_yield_coefficient: number;
    measurement_unit: IMeasurementUnit;
}