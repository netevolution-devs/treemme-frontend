import {useTranslation} from "react-i18next";
import type {
    ICurrenciesExchangeStoreState
} from "@features/panels/commercial/currenciesExchange/CurrenciesExchangePanel.tsx";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import {currencyChangeApi} from "@features/panels/commercial/currenciesExchange/api/currencyChangeApi.ts";
import {useMemo, useRef} from "react";
import type {MRT_ColumnDef} from "material-react-table";
import type {ICurrencyChange} from "@features/panels/commercial/currenciesExchange/api/ICurrencyChange.ts";
import GenericList from "@features/panels/shared/GenericList.tsx";
import ListToolbar from "@features/panels/shared/ListToolbar.tsx";
import {NewButton} from "@features/panels/shared/CustomButton.tsx";
import dayjs from "dayjs";
import type {IDialogActions} from "@ui/dialog/IDialogActions.ts";
import {openDialog} from "@ui/dialog/dialogHelper.ts";
import CurrenciesExchangeFormDialog from "@features/panels/commercial/currenciesExchange/exchange/CurrenciesExchangeFormDialog.tsx";

const CurrenciesExchangeList = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, ICurrenciesExchangeStoreState>();
    const selectedCurrencyId = useStore((state) => state.uiState.selectedCurrencyId);
    const selectedCurrencyExchangeId = useStore((state) => state.uiState.selectedCurrencyExchangeId);
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

    const addExchangeDialogRef = useRef<IDialogActions | null>(null);

    return (
        <>
            <CurrenciesExchangeFormDialog ref={addExchangeDialogRef}/>
            <GenericList<ICurrencyChange>
                data={selectedCurrencyId ? currenciesExchange : []}
                isLoading={isLoading}
                columns={columns}
                selectedId={selectedCurrencyExchangeId}
                onRowSelect={(id) => setUIState({selectedCurrencyExchangeId: id as number})}
                additionalOptions={{
                    enableTopToolbar: true,
                    renderTopToolbar: () => (
                        <ListToolbar
                            buttons={[
                                <NewButton
                                    isEnable={!!selectedCurrencyId}
                                    onClick={() => {
                                        openDialog(addExchangeDialogRef)
                                    }}
                                />
                            ]}
                        />
                    )
                }}
            />
        </>
    )
}

export default CurrenciesExchangeList;