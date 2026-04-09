import type {IWarehouseMovementReason} from "@features/panels/shared/api/warehouse-movement/IWarehouseMovement";

export interface IDeliveryReason {
    id: number;
    name: string;
    warehouse_movement_reason: IWarehouseMovementReason;
}