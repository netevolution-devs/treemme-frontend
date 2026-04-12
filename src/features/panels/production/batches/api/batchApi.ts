import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory";
import type {IBatch} from "@features/panels/production/batches/api/IBatch";
import useApi from "@api/useApi";

export interface IBatchesPayload extends Omit<IBatch, 'id'
    | 'leather'
    | 'batch_type'
    | 'measurement_unit'
    | 'check_user'
    | 'sq_ft_average_expected'
    | 'sq_ft_average_found'
    | 'stock_items'
    | 'stock_quantity'
    | 'batch_code'
> {
    leather_id: number;
    batch_type_id: number;
    measurement_unit_id: number;
}

export const batchApi = {
    ...createPanelApi<IBatch, IBatchesPayload>({
        baseEndpoint: "/batch",
        queryKey: "BATCH"
    }),
    useGetPdf: () => {
        const {get} = useApi();
        return async (id: number) => {
            const response = await get<Blob>(`/batch/${id}/pdf`, {
                responseType: "blob",
            });
            const blob = new Blob([response.data as unknown as BlobPart], {type: "application/pdf"});
            const url = window.URL.createObjectURL(blob);
            window.open(url, "_blank");
        };
    },
};