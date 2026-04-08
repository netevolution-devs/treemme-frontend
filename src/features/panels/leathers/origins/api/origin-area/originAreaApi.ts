import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory";
import type {IOriginArea} from "@features/panels/leathers/origins/api/origin-area/IOriginArea";

export const originAreaApi = createPanelApi<IOriginArea>({
    baseEndpoint: "/leather-provenance-area",
    queryKey: "LEATHER-ORIGIN-AREA"
});