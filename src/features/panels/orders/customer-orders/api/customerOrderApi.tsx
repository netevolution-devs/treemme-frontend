import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.tsx";
import type {ICustomerOrder} from "@features/panels/orders/customer-orders/api/ICustomerOrder.ts";

export const customerOrderApi = createPanelApi<ICustomerOrder>({
    baseEndpoint: "/client-order",
    queryKey: "CLIENT-ORDER"
});