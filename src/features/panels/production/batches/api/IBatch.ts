import type {IMeasurementUnit} from "@features/panels/shared/api/measurement-unit/IMeasurementUnit.ts";
import type {ILeather} from "@features/panels/leathers/leathers/api/ILeather.ts";

export interface IBatch {
    id: number;
    leather: ILeather;
    batch_type: unknown;
    measurement_unit: IMeasurementUnit;
    check_user: unknown;
    completed: boolean;
    checked: boolean;
    batch_code: string;
    batch_date: string;
    pieces: number;
    quantity: number;
    stock_items: number;
    stock_quantity: number;
    selection_note: string;
    batch_note: string;
    sampling: boolean;
    split_selected: boolean;
    sq_ft_average_expected: number;
    sq_ft_average_found: number;
    check_date: string;
    check_note: string;
}