import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext";
import type {
    ICurrenciesExchangeStoreState
} from "@features/panels/commercial/currenciesExchange/CurrenciesExchangePanel";
import {useMemo} from "react";
import type {MRT_ColumnDef} from "material-react-table";
import GenericList from "@features/panels/shared/GenericList";
import {currencyApi} from "@features/panels/shared/api/currency/currencyApi";
import ListToolbar from "@features/panels/shared/ListToolbar";
import type {ICurrency} from "@features/panels/shared/api/currency/ICurrency";

const CurrenciesList = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, ICurrenciesExchangeStoreState>();
    const selectedCurrencyId = useStore((state) => state.uiState.selectedCurrencyId);
    const setUIState = useStore((state) => state.setUIState);

    const {data: currencies = [], isLoading, isFetching} = currencyApi.useGetList();
    const exportMutation = currencyApi.useExport();

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
        }
    ], [t])

    return (
        <GenericList<ICurrency>
            data={currencies}
            isLoading={isLoading}
            isFetching={isFetching}
            columns={columns}
            selectedId={selectedCurrencyId}
            onRowSelect={(id) => setUIState({selectedCurrencyId: id})}
            additionalOptions={{
                enableTopToolbar: true,
                renderTopToolbar: () => (
                    <ListToolbar
                        onExport={() => exportMutation.mutate()}
                        exportLoading={exportMutation.isPending}
                    />
                )
            }}
        />
    )
}

export default CurrenciesList;