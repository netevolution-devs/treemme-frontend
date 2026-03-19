import {useFormContext, useWatch} from "react-hook-form";
import {useEffect} from "react";
import type {ICurrency} from "@features/panels/shared/api/currency/ICurrency.ts";

interface ICurrencyWatcherProps {
    currencies: ICurrency[];
}

const CurrencyWatcher= ({currencies}: ICurrencyWatcherProps) => {
    const {setValue} = useFormContext();
    const currencyId = useWatch({name: 'currency_id'});

    useEffect(() => {
        if (currencyId) {
            const currency = currencies.find(c => c.id === currencyId);
            if (currency) {
                setValue('currency_change', currency.last_change?.change_value ?? 0);
                setValue('currency_exchange', currency.last_change?.change_value ?? 0);
            }
        }
    }, [currencyId, currencies, setValue]);

    return null;
};

export default CurrencyWatcher;