import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory";
import type {ILeatherType} from "@features/panels/leathers/types/api/ILeatherType";

export interface ILeatherTypePayload extends Omit<ILeatherType, 'id' | 'thickness'> {
    thickness_id: number,
}

export const leatherTypeApi = createPanelApi<ILeatherType, ILeatherTypePayload>({
    baseEndpoint: "/leather-type",
    queryKey: "LEATHER-TYPE"
});