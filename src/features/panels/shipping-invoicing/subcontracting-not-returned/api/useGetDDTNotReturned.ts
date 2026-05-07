import {useQuery} from "@tanstack/react-query";
import useApi from "@api/useApi";
import type {
  IDeliveryNoteRow
} from "@features/panels/shipping-invoicing/delivery-notes/delivery-notes-row/api/IDeliveryNoteRow";

export interface IDDTRowNotReturned extends IDeliveryNoteRow {
  ddt: {
    id: number;
    ddt_number: string;
    subcontractor: {
      id: number;
      name: string;
    }
  }
}

interface IDDTNotReturnedQueryParams {
  start_date?: string;
  end_date?: string;
  subcontractor_id?: number;
}

const useGetDDTNotReturned = ({queryParams}: { queryParams?: IDDTNotReturnedQueryParams } = {}) => {
  const { get } = useApi();
  return useQuery({
    queryKey: ['DDT-ROW-NOT-RETURNED', 'LIST', queryParams],
    queryFn: async () => {

      const response = await get<IDDTRowNotReturned[]>(`/ddt-row/subcontracting-not-returned`, {
        params: queryParams
      });
      return response.data.data;
    },
    staleTime: 0,
    gcTime: 0,
  });
};

export default useGetDDTNotReturned;