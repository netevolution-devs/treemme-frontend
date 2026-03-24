import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.ts";
import type {ICurrencyChange} from "@features/panels/commercial/currenciesExchange/api/ICurrencyChange.ts";

export const currencyChangeApi = createPanelApi<ICurrencyChange>({
    baseEndpoint: "/currency-change",
    queryKey: "CURRENCY-CHANGE"
});