import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory";
import type {ICarrier} from "@features/panels/contacts/carriers/api/ICarrier";

export const carrierApi = createPanelApi<ICarrier>({
    baseEndpoint: "/shipping-carrier",
    queryKey: "CARRIER"
});