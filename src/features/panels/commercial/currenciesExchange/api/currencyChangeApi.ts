import {createPanelApi} from "@features/panels/shared/hooks/createPanelApiFactory";
import type {ICurrencyChange} from "@features/panels/commercial/currenciesExchange/api/ICurrencyChange";
import type {
    ICurrenciesExchangeForm
} from "@features/panels/commercial/currenciesExchange/exchange/CurrenciesExchangeFormDialog";

export type ICurrencyChangePayload = ICurrenciesExchangeForm;

export const currencyChangeApi = createPanelApi<ICurrencyChange, ICurrencyChangePayload>({
    baseEndpoint: "/currency-change",
    queryKey: "CURRENCY-CHANGE"
});