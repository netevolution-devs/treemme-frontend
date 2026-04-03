import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.ts";
import type {
    IShipmentCondition
} from "@features/panels/commercial/shipment-conditions/api/IShipmentCondition.ts";
import type {IShipmentConditionForm} from "@features/panels/commercial/shipment-conditions/ShipmentConditionForm.tsx";

export type IShipmentConditionPayload = IShipmentConditionForm;

export const shipmentConditionApi = createPanelApi<IShipmentCondition, IShipmentConditionPayload>({
    baseEndpoint: "/shipment-condition",
    queryKey: "SHIPMENT-CONDITION",
});