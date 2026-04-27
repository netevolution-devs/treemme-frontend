import {useFormContext, useWatch} from "react-hook-form";
import {useEffect, useRef} from "react";
import type {ICurrency} from "@features/panels/shared/api/currency/ICurrency";

interface ICurrencyWatcherProps {
    currencies: ICurrency[];
    exchangeFieldName: string;
    isEditMode: boolean;
    entityCurrencyId?: number | null;
}

const CurrencyWatcher = ({ currencies, exchangeFieldName, isEditMode, entityCurrencyId }: ICurrencyWatcherProps) => {
    const { setValue, setError, clearErrors } = useFormContext();
    const currencyId = useWatch({ name: 'currency_id' });

    const prevCurrencyIdRef = useRef<number | null>(null);
    const isFirstLoad = useRef(true);
    const hasSeededRef = useRef(false);

    // Seed prevCurrencyIdRef with the entity's currency before the main effect runs,
    // so that form.reset() triggered by entity load is not mistaken for a user-initiated change.
    // This effect must be defined BEFORE the main effect.
    useEffect(() => {
        if (isEditMode && entityCurrencyId && !hasSeededRef.current) {
            prevCurrencyIdRef.current = entityCurrencyId;
            hasSeededRef.current = true;
        }
    }, [isEditMode, entityCurrencyId]);

    useEffect(() => {
        if (!currencyId || !currencies.length) return;

        const currency = currencies.find(c => c.id === currencyId);
        if (!currency) return;

        const abbreviation = currency.abbreviation?.toUpperCase();
        const isEur = abbreviation === "EUR";
        const lastChangeValue = currency.last_change?.change_value;

        if (isEur) {
            setValue(exchangeFieldName, 1);
            clearErrors(exchangeFieldName);
            if (isFirstLoad.current) {
                isFirstLoad.current = false;
            }
        }
        else if (isFirstLoad.current) {
            if (isEditMode) {
                // Editing existing record → keep actualFieldValue as-is
                clearErrors(exchangeFieldName);
            } else if (lastChangeValue) {
                // Creating new record → fill from lastChangeValue
                setValue(exchangeFieldName, lastChangeValue);
                clearErrors(exchangeFieldName);
            } else {
                // Creating new record, no lastChangeValue → error
                setError(exchangeFieldName, {
                    type: "manual",
                    message: "Ultimo cambio valuta non trovato.",
                });
            }
            isFirstLoad.current = false;
        }
        else if (prevCurrencyIdRef.current !== null && prevCurrencyIdRef.current !== currencyId) {
            if (lastChangeValue) {
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

        // In edit mode, do not overwrite the seeded entity currency with the EUR emptyValues default.
        // EUR at this point can only mean the form hasn't received the entity's currency yet.
        if (!(isEur && isEditMode && hasSeededRef.current)) {
            prevCurrencyIdRef.current = currencyId;
        }

    }, [currencyId, currencies, exchangeFieldName, isEditMode, setValue, setError, clearErrors]);

    useEffect(() => {
        return () => {
            isFirstLoad.current = true;
            prevCurrencyIdRef.current = null;
            hasSeededRef.current = false;
        };
    }, []);

    return null;
};

export default CurrencyWatcher;