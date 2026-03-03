import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.tsx";
import type {IOrigin} from "@features/panels/leathers/origins/api/IOrigin.ts";

export interface IOriginPayload extends Omit<IOrigin, 'id' | 'area' | 'nation' | 'flay' | 'sea_shipment'> {
    area_id: number,
    nation_id: number,
    flay_id: number,
    sea_shipment: boolean,
}

export const originApi = createPanelApi<IOrigin, IOriginPayload>({
    baseEndpoint: "/leather-provenance",
    queryKey: "LEATHER-ORIGIN"
});