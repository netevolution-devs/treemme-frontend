import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.ts";
import type {
    IShipmentCondition
} from "@features/panels/orders/customer-orders/api/shipment-condition/IShipmentCondition.ts";

export const shipmentConditionApi = createPanelApi<IShipmentCondition>({
    baseEndpoint: "/shipment-condition",
    queryKey: "SHIPMENT-CONDITION",
});