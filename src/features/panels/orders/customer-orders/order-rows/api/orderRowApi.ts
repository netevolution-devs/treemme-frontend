import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.ts";
import type {IOrderRow} from "@features/panels/orders/customer-orders/order-rows/api/IOrderRow.ts";
import type {IOrderRowForm} from "@features/panels/orders/customer-orders/order-rows/OrderRowsForm.tsx";

export type IOrderRowPayload = IOrderRowForm;
export const orderRowApi = createPanelApi<IOrderRow, IOrderRowPayload>({
    baseEndpoint: "/client-order-row",
    queryKey: "CLIENT-ORDER-ROW"
});