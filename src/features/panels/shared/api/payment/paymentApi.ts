import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.tsx";
import type {IPayment} from "@features/panels/shared/api/payment/IPayment.ts";

export const paymentApi = createPanelApi<IPayment>({
    baseEndpoint: "/payment",
    queryKey: "PAYMENT"
});