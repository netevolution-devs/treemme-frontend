import {useFormContext, useWatch} from "react-hook-form";
import {useEffect, useRef} from "react";
import type {ICurrency} from "@features/panels/shared/api/currency/ICurrency.ts";

interface ICurrencyWatcherProps {
    currencies: ICurrency[];
    exchangeFieldName: string;
}

const CurrencyWatcher = ({ currencies, exchangeFieldName }: ICurrencyWatcherProps) => {
    const { setValue, setError, clearErrors, getValues } = useFormContext();
    const currencyId = useWatch({ name: 'currency_id' });
    const previousCurrencyId = useRef<number | null>(null);

    useEffect(() => {
        if (!currencyId || currencies.length === 0) {
            return;
        }

        const currency = currencies.find(c => c.id === currencyId);
        const currentValue = getValues(exchangeFieldName);

        console.log("CurrencyWatcher", currentValue);

        if (previousCurrencyId.current === currencyId) {
            return;
        }

        const isInitialLoad = previousCurrencyId.current === null;
        previousCurrencyId.current = currencyId;

        const isEur = currency?.abbreviation.toUpperCase() === "EUR";
        const hasValidValue = currentValue !== undefined && currentValue !== null && (
            (isEur && currentValue === 1) || (currentValue !== 0)
        );

        if (isInitialLoad && hasValidValue) {
            return;
        }

        if (currency) {
            if (currentValue) {
                setValue(exchangeFieldName, currentValue);
            } else {
                if (currency.last_change) {
                    const newRate = currency.last_change.change_value ?? 0;
                    setValue(exchangeFieldName, newRate);
                    clearErrors(exchangeFieldName);
                } else {
                    if (isEur) {
                        setValue(exchangeFieldName, 1);
                        clearErrors(exchangeFieldName);
                    } else {
                        setError(exchangeFieldName, {
                            type: "manual",
                            message: "Ultimo cambio valuta non trovato. Inserirlo nella apposita scheda",
                        });
                        setValue(exchangeFieldName, 0);
                    }
                }
            }
        }
    }, [currencyId, currencies, setValue, exchangeFieldName, setError, clearErrors, getValues]);

    return null;
};

export default CurrencyWatcher;