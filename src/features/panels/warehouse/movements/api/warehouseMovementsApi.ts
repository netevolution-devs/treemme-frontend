import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory";
import type {IWarehouseMovement} from "@features/panels/shared/api/warehouse-movement/IWarehouseMovement";

export const warehouseMovementsApi = createPanelApi<IWarehouseMovement>({
    baseEndpoint: "/warehouse-movement",
    queryKey: "WAREHOUSE-MOVEMENT"
});