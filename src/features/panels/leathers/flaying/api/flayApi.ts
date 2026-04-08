import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory";
import type {IFlay} from "@features/panels/leathers/flaying/api/IFlay";

export const flayApi = createPanelApi<IFlay>({
    baseEndpoint: "/leather-flay",
    queryKey: "LEATHER-FLAY"
});