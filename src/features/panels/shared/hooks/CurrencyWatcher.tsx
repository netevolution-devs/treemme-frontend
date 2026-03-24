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
    const isFirstRun = useRef(true);

    useEffect(() => {
        if (currencyId) {
            const currency = currencies.find(c => c.id === currencyId);

            if (currency) {
                if (currency.last_change) {
                    const newRate = currency.last_change.change_value ?? 0;

                    setValue(exchangeFieldName, newRate);
                    clearErrors(exchangeFieldName);
                } else {
                    const currentValue = getValues(exchangeFieldName);

                    const isEur = currency.abbreviation.toUpperCase() === "EUR";
                    const hasValue = currentValue !== undefined && currentValue !== null && currentValue !== 0;

                    if (isEur && hasValue) {
                        clearErrors(exchangeFieldName);
                    } else if (!hasValue || !isFirstRun.current) {
                        setValue(exchangeFieldName, 0);
                        setError(exchangeFieldName, {
                            type: "manual",
                            message: "Ultimo cambio valuta non trovato. Inserirlo nella apposita scheda",
                        });
                    }
                }
            }
        }
        isFirstRun.current = false;
    }, [currencyId, currencies, setValue, exchangeFieldName, setError, clearErrors, getValues]);

    return null;
};

export default CurrencyWatcher;