import type {IMeasurementUnit} from "@features/panels/shared/api/measurement-unit/IMeasurementUnit.ts";
import type {ILeather} from "@features/panels/leathers/leathers/api/ILeather.ts";
import type {IBatchType} from "@features/panels/production/batches/api/batch-type/IBatchType.ts";
import type {IUser} from "@features/user/model/UserInterfaces.ts";
import type {IWarehouseMovement} from "@features/panels/shared/api/warehouse-movement/IWarehouseMovement.ts";

export interface IFatherBatch {
    id: number;
    batch: IBatch;
    father_batch_piece: number;
    father_batch_quantity: number;
    composition_note: string;
}

export interface IBatch {
    id: number;
    leather: ILeather;
    batch_type: IBatchType;
    measurement_unit: IMeasurementUnit;
    check_user: IUser;
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
    son_batches: IFatherBatch[];
    batch_selections: unknown[];
    warehouse_movements: IWarehouseMovement[];
}