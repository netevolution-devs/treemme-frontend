import {useTranslation} from "react-i18next";
import type {
    ICurrenciesExchangeStoreState
} from "@features/panels/commercial/currenciesExchange/CurrenciesExchangePanel.tsx";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import {currencyChangeApi} from "@features/panels/commercial/currenciesExchange/api/currencyChangeApi.ts";
import {useMemo} from "react";
import type {MRT_ColumnDef} from "material-react-table";
import type {ICurrencyChange} from "@features/panels/commercial/currenciesExchange/api/ICurrencyChange.ts";
import GenericList from "@features/panels/shared/GenericList.tsx";
import ListToolbar from "@features/panels/shared/ListToolbar.tsx";
import {NewButton} from "@features/panels/shared/CustomButton.tsx";
import dayjs from "dayjs";

const CurrenciesExchangeList = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, ICurrenciesExchangeStoreState>();
    const selectedCurrencyId = useStore((state) => state.uiState.selectedCurrencyId);
    const setUIState = useStore((state) => state.setUIState);

    const {data: currenciesExchange = [], isLoading} = currencyChangeApi.useGetList({queryParams: {currency: selectedCurrencyId as number}});

    const columns = useMemo<MRT_ColumnDef<ICurrencyChange>[]>(() => [
        {
            accessorKey: "date",
            header: t("currencies.date"),
            Cell: ({row}) => dayjs(row.original.date).format("DD/MM/YYYY")
        },
        {
            accessorKey: "change_value",
            header: t("currencies.change_value"),
        }
    ], [t])

    return (
        <GenericList<ICurrencyChange>
            data={selectedCurrencyId ? currenciesExchange : []}
            isLoading={isLoading}
            columns={columns}
            selectedId={selectedCurrencyId}
            onRowSelect={(id) => setUIState({selectedCurrencyId: id})}
            additionalOptions={{
                enableTopToolbar: true,
                renderTopToolbar: () => (
                    <ListToolbar
                        buttons={[
                            <NewButton
                                isEnable={!!selectedCurrencyId}
                                onClick={() => {}}
                            />
                        ]}
                    />
                )
            }}
        />
    )
}

export default CurrenciesExchangeList;