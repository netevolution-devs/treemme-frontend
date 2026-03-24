import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.ts";
import type {ICurrency} from "@features/panels/shared/api/currency/ICurrency.ts";
import type {ICurrenciesForm} from "@features/panels/commercial/currenciesExchange/CurrenciesForm.tsx";

export type ICurrencyPayload = ICurrenciesForm;

export const currencyApi = createPanelApi<ICurrency, ICurrencyPayload>({
    baseEndpoint: "/currency",
    queryKey: "CURRENCY"
})