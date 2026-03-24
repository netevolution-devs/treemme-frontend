import {useTranslation} from "react-i18next";
import type {
    ICurrenciesExchangeStoreState
} from "@features/panels/commercial/currenciesExchange/CurrenciesExchangePanel.tsx";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import {currencyApi} from "@features/panels/shared/api/currency/currencyApi.ts";
import type {ICurrency} from "@features/panels/shared/api/currency/ICurrency.ts";
import GenericForm from "@features/panels/shared/GenericForm.tsx";
import TextFieldControlled from "@ui/form/controlled/TextFieldControlled.tsx";

export type ICurrenciesForm = Omit<ICurrency, 'id' | 'last_change'>;

const CurrenciesForm = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, ICurrenciesExchangeStoreState>();
    const selectedCurrencyId = useStore((state) => state.uiState.selectedCurrencyId);
    const setUIState = useStore((state) => state.setUIState);

    const {useGetDetail, usePost, usePut, useDelete} = currencyApi;
    const {data: currency} = useGetDetail(selectedCurrencyId);
    const {mutateAsync: createCurrency, isPending: isPosting} = usePost();
    const {mutateAsync: updateCurrency, isPending: isPutting} = usePut();
    const {mutateAsync: deleteCurrency, isPending: isDeleting} = useDelete();

    return (
        <GenericForm<ICurrenciesForm>
            selectedId={selectedCurrencyId}
            entity={currency}
            emptyValues={{
                name: '',
                abbreviation: '',
                sign: ''
            }}
            mapEntityToForm={(x) => ({
                name: x.name,
                abbreviation: x.abbreviation,
                sign: x.sign
            })}
            create={(payload) => createCurrency(payload)}
            update={(id, payload) => updateCurrency({id, payload})}
            remove={(id) => deleteCurrency(id)}
            isSaving={isPosting || isPutting}
            isDeleting={isDeleting}
            onClearSelection={() => setUIState({selectedCurrencyId: null})}
            validateBeforeSave={(v) => !!v.name && !!v.abbreviation && !!v.sign}
            renderFields={() => (
                <>
                    <TextFieldControlled<ICurrenciesForm>
                        name="name"
                        label={t("currencies.name")}
                        required
                    />
                    <TextFieldControlled<ICurrenciesForm>
                        name="sign"
                        label={t("currencies.sign")}
                        required
                    />
                    <TextFieldControlled<ICurrenciesForm>
                        name="abbreviation"
                        label={t("currencies.abbreviation")}
                        required
                    />
                </>
            )}
        />
    );
};

export default CurrenciesForm;