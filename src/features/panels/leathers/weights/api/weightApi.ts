import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.tsx";
import type {IWeight} from "@features/panels/leathers/weights/api/IWeight.ts";

export interface IWeightPayload extends Omit<IWeight, 'id' | 'kg_weight' | 'cost_stripped_crust_manual' | 'cost_stripped_crust_various' | 'kg_leather_expected' | 'sqft_leather_expected'>{
    kg_weight: number,
    cost_stripped_crust_manual?: number,
    cost_stripped_crust_various?: number,
    kg_leather_expected?: number,
    sqft_leather_expected?: number,
}

export const weightApi = createPanelApi<IWeight, IWeightPayload>({
    baseEndpoint: "/leather-weight",
    queryKey: "LEATHER-WEIGHT"
})