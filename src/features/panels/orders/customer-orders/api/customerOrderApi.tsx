import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.tsx";
import type {ICustomerOrder} from "@features/panels/orders/customer-orders/api/ICustomerOrder.ts";
import type {ICustomerOrderForm} from "@features/panels/orders/customer-orders/CustomerOrdersForm.tsx";

export type ICustomerOrderPayload = ICustomerOrderForm;

export const customerOrderApi = createPanelApi<ICustomerOrder, ICustomerOrderPayload>({
    baseEndpoint: "/client-order",
    queryKey: "CLIENT-ORDER"
});