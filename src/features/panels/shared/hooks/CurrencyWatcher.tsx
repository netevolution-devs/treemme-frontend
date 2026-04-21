import {useFormContext, useWatch} from "react-hook-form";
import {useEffect, useRef} from "react";
import type {ICurrency} from "@features/panels/shared/api/currency/ICurrency";

interface ICurrencyWatcherProps {
    currencies: ICurrency[];
    exchangeFieldName: string;
}

const CurrencyWatcher = ({ currencies, exchangeFieldName }: ICurrencyWatcherProps) => {
    const { setValue, setError, clearErrors, getValues } = useFormContext();
    const currencyId = useWatch({ name: 'currency_id' });

    const prevCurrencyIdRef = useRef(null);
    const isFirstLoad = useRef(true);

    useEffect(() => {
        if (!currencyId || !currencies.length) return;

        const currency = currencies.find(c => c.id === currencyId);
        if (!currency) return;

        const abbreviation = currency.abbreviation?.toUpperCase();
        const isEur = abbreviation === "EUR";
        const lastChangeValue = currency.last_change?.change_value;

        const actualFieldValue = getValues(exchangeFieldName);
        const hasValue = actualFieldValue !== undefined && actualFieldValue !== null && actualFieldValue !== 0;

        if (isEur) {
            setValue(exchangeFieldName, 1);
            clearErrors(exchangeFieldName);
            if (isFirstLoad.current) {
                isFirstLoad.current = false;
            }
        }

        else if (isFirstLoad.current) {
            if (hasValue) {
                // Se c'è già un prezzo (modifica record), non tocchiamo nulla
                clearErrors(exchangeFieldName);
            } else if (lastChangeValue) {
                // Se il campo è vuoto, carichiamo il default dal DB
                setValue(exchangeFieldName, lastChangeValue);
                clearErrors(exchangeFieldName);
            } else {
                // Se è tutto vuoto, diamo errore
                setError(exchangeFieldName, {
                    type: "manual",
                    message: "Ultimo cambio valuta non trovato.",
                });
            }
            isFirstLoad.current = false;
        }

        else if (prevCurrencyIdRef.current !== null && prevCurrencyIdRef.current !== currencyId) {            if (lastChangeValue) {
                setValue(exchangeFieldName, lastChangeValue);
                clearErrors(exchangeFieldName);
            } else {
                setValue(exchangeFieldName, 0);
                setError(exchangeFieldName, {
                    type: "manual",
                    message: "Ultimo cambio valuta non trovato.",
                });
            }
        }

        prevCurrencyIdRef.current = currencyId;

    }, [currencyId, currencies, exchangeFieldName, setValue, setError, clearErrors, getValues]);

    useEffect(() => {
        return () => {
            isFirstLoad.current = true;
            prevCurrencyIdRef.current = null;
        };
    }, []);

    return null;
};

export default CurrencyWatcher;