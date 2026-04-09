import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory";
import type {ICurrency} from "@features/panels/shared/api/currency/ICurrency";
import type {ICurrenciesForm} from "@features/panels/commercial/currenciesExchange/CurrenciesForm";

export type ICurrencyPayload = ICurrenciesForm;

export const currencyApi = createPanelApi<ICurrency, ICurrencyPayload>({
    baseEndpoint: "/currency",
    queryKey: "CURRENCY"
})