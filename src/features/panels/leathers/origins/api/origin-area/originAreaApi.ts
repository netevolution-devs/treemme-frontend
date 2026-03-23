import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.ts";
import type {IOriginArea} from "@features/panels/leathers/origins/api/origin-area/IOriginArea.ts";

export const originAreaApi = createPanelApi<IOriginArea>({
    baseEndpoint: "/leather-provenance-area",
    queryKey: "LEATHER-ORIGIN-AREA"
});