import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory";
import type {ICustomerOrder} from "@features/panels/orders/customer-orders/api/ICustomerOrder";
import type {ICustomerOrderForm} from "@features/panels/orders/customer-orders/CustomerOrdersForm";
import {useMutation} from "@tanstack/react-query";
import {useTranslation} from "react-i18next";

export type ICustomerOrderPayload = ICustomerOrderForm;

export const customerOrderApi = {
    ...createPanelApi<ICustomerOrder, ICustomerOrderPayload>({
        baseEndpoint: "/client-order",
        queryKey: "CLIENT-ORDER"
    }),
    useGetPdf: () => {
        const {i18n} = useTranslation();
        return useMutation({
            mutationFn: async (id: number) => {
                window.open(`${import.meta.env.VITE_API}/client-order/${id}/pdf?lang=${i18n.language || 'it'}`, "_blank");
            },
            mutationKey: ['CLIENT-ORDER-PDF'],
        });
    },
};