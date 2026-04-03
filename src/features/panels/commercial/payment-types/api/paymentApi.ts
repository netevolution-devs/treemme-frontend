import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.ts";
import type {IPayment} from "@features/panels/commercial/payment-types/api/IPayment.ts";

export const paymentApi = createPanelApi<IPayment>({
    baseEndpoint: "/api",
    queryKey: "PAYMENT"
});