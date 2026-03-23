import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.ts";
import type {IFlay} from "@features/panels/leathers/flaying/api/IFlay.ts";

export const flayApi = createPanelApi<IFlay>({
    baseEndpoint: "/leather-flay",
    queryKey: "LEATHER-FLAY"
});