import type {IMeasurementUnit} from "@features/panels/shared/api/measurement-unit/IMeasurementUnit";

export interface IPallet {
    id: number;
    measurement_unit: IMeasurementUnit;
    name: string;
    weight: number;
}