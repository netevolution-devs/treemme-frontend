import {useQuery} from "@tanstack/react-query";
import useApi from "@api/useApi";
import type {ApiOptions} from "@features/panels/shared/hooks/createPanelApiFactory";
import type {IDeliveryNoteRow} from "@features/panels/shipping-invoicing/delivery-notes/delivery-notes-row/api/IDeliveryNoteRow";
import type {IDeliveryNote} from "@features/panels/shipping-invoicing/delivery-notes/api/IDeliveryNote";
import type {IOrderRow} from "@features/panels/orders/customer-orders/order-rows/api/IOrderRow";

export interface IDDTRowSold extends IDeliveryNoteRow {
    ddt: IDeliveryNote;
    order_row?: IOrderRow;
}

const useGetDDTRowSold = (options?: ApiOptions) => {
    const { get } = useApi();
    return useQuery({
        queryKey: ['DDT-ROW-SOLD', 'LIST', options?.queryParams],
        queryFn: async () => {

            const response = await get<IDDTRowSold[]>(
                `/ddt-row/sold`,
                {params: options?.queryParams}
            );
            return response.data.data;
        },
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10
    });
};

export default useGetDDTRowSold;
