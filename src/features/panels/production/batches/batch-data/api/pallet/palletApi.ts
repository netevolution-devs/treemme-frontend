import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory";
import type {IPallet} from "@features/panels/production/batches/batch-data/api/pallet/IPallet";

export const palletApi = createPanelApi<IPallet>({
    baseEndpoint: "/pallet",
    queryKey: "PALLET"
});