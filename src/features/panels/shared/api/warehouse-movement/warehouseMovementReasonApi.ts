import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.ts";
import type {IWarehouseMovementReason} from "@features/panels/shared/api/warehouse-movement/IWarehouseMovement.ts";

export const warehouseMovementReasonApi = createPanelApi<IWarehouseMovementReason>({
    baseEndpoint: "/warehouse-movement-reason",
    queryKey: "WAREHOUSE-MOVEMENT-REASON"
});
