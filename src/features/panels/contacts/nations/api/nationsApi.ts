import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory";
import type {INation} from "@features/panels/contacts/nations/api/INation";

export const nationsApi = createPanelApi<INation>({
    baseEndpoint: "/nation",
    queryKey: "NATION"
});