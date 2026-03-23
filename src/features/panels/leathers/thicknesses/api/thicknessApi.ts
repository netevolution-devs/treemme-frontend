import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.ts";
import type {IThickness} from "@features/panels/leathers/thicknesses/api/IThickness.ts";

export interface IThicknessPayload extends Omit<IThickness, 'id' | 'thickness_mm'> {
    thickness_mm: number,
}

export const thicknessApi = createPanelApi<IThickness>({
    baseEndpoint: "/leather-thickness",
    queryKey: "LEATHER-THICKNESS"
});