import type {IContact} from "@features/panels/contacts/contacts/api/IContact.ts";

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
    reason: IWarehouseMovementReason;
    date: string;
    piece: number;
    price: number | null;
    ddt_number: number | null;
    ddt_date: string | null;
    movement_note: string;
    contact: IContact;
}