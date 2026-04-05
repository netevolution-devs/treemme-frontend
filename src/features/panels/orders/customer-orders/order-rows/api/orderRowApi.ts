import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory";
import type {IOrderRow} from "@features/panels/orders/customer-orders/order-rows/api/IOrderRow";
import type {IOrderRowForm} from "@features/panels/orders/customer-orders/order-rows/OrderRowsForm";

export type IOrderRowPayload = IOrderRowForm;
export const orderRowApi = createPanelApi<IOrderRow, IOrderRowPayload>({
    baseEndpoint: "/client-order-row",
    queryKey: "CLIENT-ORDER-ROW"
});