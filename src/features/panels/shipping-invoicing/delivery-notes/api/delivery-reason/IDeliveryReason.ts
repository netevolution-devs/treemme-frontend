import type {IWarehouseMovementReason} from "@features/panels/shared/api/warehouse-movement/IWarehouseMovement.ts";

export interface IDeliveryReason {
    id: number;
    name: string;
    warehouse_movement_reason: IWarehouseMovementReason;
}