import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.tsx";
import type {INation} from "@features/panels/contacts/nations/api/INation.ts";

export const nationsApi = createPanelApi<INation>({
    baseEndpoint: "/nation",
    queryKey: "NATION"
});