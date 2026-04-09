import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory";
import type {ISeaPort} from "@features/panels/contacts/seaports/api/ISeaPort";

export const seaPortApi = createPanelApi<ISeaPort>({
    baseEndpoint: "/sea-port",
    queryKey: "SEA-PORT"
});
