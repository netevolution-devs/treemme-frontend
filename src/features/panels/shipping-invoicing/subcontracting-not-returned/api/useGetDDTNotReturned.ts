import {useQuery} from "@tanstack/react-query";
import useApi from "@api/useApi.ts";
import type {IDeliveryNote} from "@features/panels/shipping-invoicing/delivery-notes/api/IDeliveryNote.ts";

interface IGetDDTNotReturnedParams {
  enabled?: boolean;
}

const useGetDDTNotReturned = ({enabled}: IGetDDTNotReturnedParams = {enabled: false}) => {
  const { get } = useApi();
  return useQuery({
    queryKey: ['DDT-NOT-RETURNED', 'LIST'],
    queryFn: async () => {

      const response = await get<IDeliveryNote[]>(`/ddt-row/subcontracting-not-returned`);
      return response.data.data;
    },
    staleTime: 0,
    gcTime: 0,
    enabled: enabled ?? true
  });
};

export default useGetDDTNotReturned;