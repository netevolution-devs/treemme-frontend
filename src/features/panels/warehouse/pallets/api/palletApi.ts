import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory";
import type {IPallet} from "@features/panels/warehouse/pallets/api/IPallet";
import type {IPalletForm} from "@features/panels/warehouse/pallets/PalletsForm";

export type IPalletPayload = IPalletForm;

export const palletApi = createPanelApi<IPallet, IPalletPayload>({
    baseEndpoint: "/pallet",
    queryKey: "PALLET"
});