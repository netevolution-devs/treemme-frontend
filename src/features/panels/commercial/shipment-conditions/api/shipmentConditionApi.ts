import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.ts";
import type {
    IShipmentCondition
} from "@features/panels/commercial/shipment-conditions/api/IShipmentCondition.ts";

export const shipmentConditionApi = createPanelApi<IShipmentCondition>({
    baseEndpoint: "/api",
    queryKey: "SHIPMENT-CONDITION",
});