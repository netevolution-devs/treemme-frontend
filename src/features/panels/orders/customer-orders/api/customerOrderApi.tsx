import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory";
import type {ICustomerOrder} from "@features/panels/orders/customer-orders/api/ICustomerOrder";
import type {ICustomerOrderForm} from "@features/panels/orders/customer-orders/CustomerOrdersForm";

export type ICustomerOrderPayload = ICustomerOrderForm;

export const customerOrderApi = createPanelApi<ICustomerOrder, ICustomerOrderPayload>({
    baseEndpoint: "/client-order",
    queryKey: "CLIENT-ORDER"
});