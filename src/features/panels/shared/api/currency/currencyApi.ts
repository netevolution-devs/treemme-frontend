import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.tsx";
import type {ICurrency} from "@features/panels/shared/api/currency/ICurrency.ts";

export const currencyApi = createPanelApi<ICurrency>({
    baseEndpoint: "/currency",
    queryKey: "CURRENCY"
})