import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory";
import type {IWarehouseMovementReason} from "@features/panels/shared/api/warehouse-movement/IWarehouseMovement";

export const warehouseMovementReasonApi = createPanelApi<IWarehouseMovementReason>({
    baseEndpoint: "/warehouse-movement-reason",
    queryKey: "WAREHOUSE-MOVEMENT-REASON"
});
