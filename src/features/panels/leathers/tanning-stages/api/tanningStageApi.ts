import type {ITanningStage} from "@features/panels/leathers/tanning-stages/api/ITanningStage";
import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory";

export interface ITanningStagePayload extends Omit<ITanningStage, 'id' | 'measurement_unit'> {
    measurement_unit_id: number;
}

export const tanningStageApi = createPanelApi<ITanningStage, ITanningStagePayload>({
    baseEndpoint: "/leather-status",
    queryKey: "LEATHER_STATUS",
});