import {useQuery} from "@tanstack/react-query";
import useApi from "@api/useApi";
import type {ApiOptions} from "@features/panels/shared/hooks/createPanelApiFactory";
import type {IDeliveryNoteRow} from "@features/panels/shipping-invoicing/delivery-notes/delivery-notes-row/api/IDeliveryNoteRow";
import type {IDeliveryNote} from "@features/panels/shipping-invoicing/delivery-notes/api/IDeliveryNote";

export interface IExternalProcessingMovementRow extends IDeliveryNoteRow {
    ddt: IDeliveryNote;
    ddt_row_processings: { processing: { id: number; name: string } }[];
}

export interface IExternalProcessingMovement {
    subcontractor: {
        id: number;
        name: string;
    };
    rows: IExternalProcessingMovementRow[];
}

export interface IFlatExternalProcessingMovement extends IExternalProcessingMovementRow {
    subcontractor: {
        id: number;
        name: string;
    };
}

const useGetExternalProcessingMovements = (options?: ApiOptions) => {
    const { get } = useApi();
    return useQuery({
        queryKey: ['EXTERNAL-PROCESSING-MOVEMENTS', 'LIST', options?.queryParams],
        queryFn: async () => {

            const response = await get<IExternalProcessingMovement[]>(
                `/ddt-row/external-processing-movements`,
                {params: options?.queryParams}
            );

            const flattenedData: IFlatExternalProcessingMovement[] = [];
            response.data.data.forEach(group => {
                group.rows.forEach(row => {
                    flattenedData.push({
                        ...row,
                        subcontractor: group.subcontractor
                    });
                });
            });

            return flattenedData;
        },
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10
    });
};

export default useGetExternalProcessingMovements;
