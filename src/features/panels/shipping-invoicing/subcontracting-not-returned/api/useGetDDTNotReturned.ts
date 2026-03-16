import {useQuery} from "@tanstack/react-query";
import useApi from "@api/useApi.ts";
import type {
  IDeliveryNoteRow
} from "@features/panels/shipping-invoicing/delivery-notes/delivery-notes-row/api/IDeliveryNoteRow.ts";

const useGetDDTNotReturned = () => {
  const { get } = useApi();
  return useQuery({
    queryKey: ['DDT-ROW-NOT-RETURNED', 'LIST'],
    queryFn: async () => {

      const response = await get<IDeliveryNoteRow[]>(`/ddt-row/subcontracting-not-returned`);
      return response.data.data;
    },
    staleTime: 0,
    gcTime: 0,
  });
};

export default useGetDDTNotReturned;