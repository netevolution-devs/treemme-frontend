import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.tsx";
import type {ISeaPort} from "@features/panels/contacts/seaports/api/ISeaPort.ts";

export const seaPortApi = createPanelApi<ISeaPort>({
    baseEndpoint: "/sea-port",
    queryKey: "SEA-PORT"
});
