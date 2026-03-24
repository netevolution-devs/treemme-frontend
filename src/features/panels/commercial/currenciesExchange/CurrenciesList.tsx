import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {
    ICurrenciesExchangeStoreState
} from "@features/panels/commercial/currenciesExchange/CurrenciesExchangePanel.tsx";
import {useMemo} from "react";
import type {MRT_ColumnDef} from "material-react-table";
import GenericList from "@features/panels/shared/GenericList.tsx";
import {currencyApi} from "@features/panels/shared/api/currency/currencyApi.ts";
import type {ICurrency} from "@features/panels/shared/api/currency/ICurrency.ts";

const CurrenciesList = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, ICurrenciesExchangeStoreState>();
    const selectedCurrencyId = useStore((state) => state.uiState.selectedCurrencyId);
    const setUIState = useStore((state) => state.setUIState);

    const {data: currencies = [], isLoading} = currencyApi.useGetList();

    const columns = useMemo<MRT_ColumnDef<ICurrency>[]>(() => [
        {
            accessorKey: "abbreviation",
            header: t("currencies.abbreviation"),
        },
        {
            accessorKey: "sign",
            header: t("currencies.sign"),
        },
        {
            accessorKey: "name",
            header: t("currencies.name"),
        },
        {
            accessorKey: "last_change",
            header: t("currencies.last_rate"),
        },
    ], [t])

    return (
        <GenericList<ICurrency>
            data={currencies}
            isLoading={isLoading}
            columns={columns}
            selectedId={selectedCurrencyId}
            onRowSelect={(id) => setUIState({selectedCurrencyId: id})}
        />
    )
}

export default CurrenciesList;