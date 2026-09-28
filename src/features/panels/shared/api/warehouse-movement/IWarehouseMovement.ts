import type {IContact} from "@features/panels/contacts/contacts/api/IContact";
import type {IBatch} from "@features/panels/production/batches/api/IBatch";

export interface IWarehouseMovementReasonType {
    id: number;
    name: string;
    movement_type: string; // + or -
}

export interface IWarehouseMovementReason {
    id: number;
    name: string;
    reason_type: IWarehouseMovementReasonType;
}

export interface IWarehouseMovement {
    id: number;
    date: string;
    batch: IBatch;
    reason: IWarehouseMovementReason;
    piece: number;
    price: number | null;
    quantity: number | null;
    total_value: number | null;
    ddt_number: number | null;
    ddt_date: string | null;
    movement_note: string;
    contact: IContact;
    subcontractor_ddt_number: number | null;
}