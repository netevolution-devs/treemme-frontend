import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory.ts";
import type {ICurrencyChange} from "@features/panels/commercial/currenciesExchange/api/ICurrencyChange.ts";
import type {
    ICurrenciesExchangeForm
} from "@features/panels/commercial/currenciesExchange/exchange/CurrenciesExchangeFormDialog.tsx";

export type ICurrencyChangePayload = ICurrenciesExchangeForm;

export const currencyChangeApi = createPanelApi<ICurrencyChange, ICurrencyChangePayload>({
    baseEndpoint: "/currency-change",
    queryKey: "CURRENCY-CHANGE"
});