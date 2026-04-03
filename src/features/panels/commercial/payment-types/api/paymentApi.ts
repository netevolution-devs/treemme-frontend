import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.ts";
import type {IPayment} from "@features/panels/commercial/payment-types/api/IPayment.ts";
import type {IPaymentForm} from "@features/panels/commercial/payment-types/PaymentTypeForm.tsx";

export type IPaymentPayload = IPaymentForm;

export const paymentApi = createPanelApi<IPayment, IPaymentPayload>({
    baseEndpoint: "/payment",
    queryKey: "PAYMENT"
});