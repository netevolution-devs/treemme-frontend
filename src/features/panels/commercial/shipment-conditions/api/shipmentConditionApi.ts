import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory";
import type {
    IShipmentCondition
} from "@features/panels/commercial/shipment-conditions/api/IShipmentCondition";
import type {IShipmentConditionForm} from "@features/panels/commercial/shipment-conditions/ShipmentConditionForm";

export type IShipmentConditionPayload = IShipmentConditionForm;

export const shipmentConditionApi = createPanelApi<IShipmentCondition, IShipmentConditionPayload>({
    baseEndpoint: "/shipment-condition",
    queryKey: "SHIPMENT-CONDITION",
});