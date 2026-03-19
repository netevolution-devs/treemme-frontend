import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.ts";
import type {ILeather} from "@features/panels/leathers/leathers/api/ILeather.ts";

export interface ILeatherPayload extends Omit<ILeather, 'id'
    | "code"
    | "name"
    | "contact"
    | "weight"
    | "thickness"
    | "flay"
    | "status"
    | "provenance"
    | "species"
    | "type"
    | "sqft_leather_min"
    | "sqft_leather_max"
    | "sqft_leather_media"
    | "sqft_leather_expected"
    | "kg_leather_min"
    | "kg_leather_max"
    | "kg_leather_media"
    | "kg_leather_expected"
    | "supplier"
    | "container_piece"
    | "crust_revenue_expected"
> {
    supplier_id: number;
    weight_id: number;
    thickness_id: number;
    flay_id: number;
    status_id: number;
    provenance_id: number;
    species_id: number;
    type_id: number;
    sqft_leather_expected?: number | null;
    kg_leather_expected?: number | null;
    container_piece?: number | null;
    crust_revenue_expected?: number | null;
}

export const leatherApi = createPanelApi<ILeather, ILeatherPayload>({
    baseEndpoint: "/leather",
    queryKey: "LEATHER"
});