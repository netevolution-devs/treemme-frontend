import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory";
import type {IPayment} from "@features/panels/commercial/payment-types/api/IPayment";
import type {IPaymentForm} from "@features/panels/commercial/payment-types/PaymentTypeForm";

export type IPaymentPayload = IPaymentForm;

export const paymentApi = createPanelApi<IPayment, IPaymentPayload>({
    baseEndpoint: "/payment",
    queryKey: "PAYMENT"
});