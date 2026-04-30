import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory";
import type {ICustomerOrder} from "@features/panels/orders/customer-orders/api/ICustomerOrder";
import type {ICustomerOrderForm} from "@features/panels/orders/customer-orders/CustomerOrdersForm";
import useApi from "@api/useApi";

export type ICustomerOrderPayload = ICustomerOrderForm;

export const customerOrderApi = {
    ...createPanelApi<ICustomerOrder, ICustomerOrderPayload>({
        baseEndpoint: "/client-order",
        queryKey: "CLIENT-ORDER"
    }),
    useGetPdf: () => {
        const {get} = useApi();
        return async (id: number) => {
            const response = await get<Blob>(`/client-order/${id}/pdf`, {
                responseType: "blob",
            });
            const blob = new Blob([response.data as unknown as BlobPart], {type: "application/pdf"});
            const url = window.URL.createObjectURL(blob);
            window.open(url, "_blank");
        };
    },
};