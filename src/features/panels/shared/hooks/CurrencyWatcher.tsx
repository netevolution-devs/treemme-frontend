import {useFormContext, useWatch} from "react-hook-form";
import {useEffect} from "react";
import type {ICurrency} from "@features/panels/shared/api/currency/ICurrency.ts";

interface ICurrencyWatcherProps {
    currencies: ICurrency[];
}

interface ICurrencyWatcherProps {
    currencies: ICurrency[];
    exchangeFieldName: string;
}

const CurrencyWatcher = ({ currencies, exchangeFieldName }: ICurrencyWatcherProps) => {
    const { setValue } = useFormContext();
    const currencyId = useWatch({ name: 'currency_id' });

    useEffect(() => {
        if (currencyId) {
            const currency = currencies.find(c => c.id === currencyId);

            if (currency && currency.last_change) {
                const newRate = currency.last_change.change_value ?? 0;

                setValue(exchangeFieldName, newRate);
            }
        }
    }, [currencyId, currencies, setValue, exchangeFieldName]);

    return null;
};

export default CurrencyWatcher;