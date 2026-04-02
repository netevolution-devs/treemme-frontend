import {useTranslation} from "react-i18next";
import {usePanel} from "@ui/panel/PanelContext.tsx";
import type {ILotsBatchesStoreState} from "@features/panels/warehouse/lots-batches/LotsBatchesPanel.tsx";
import {selectionStockAvailableApi} from "@features/panels/warehouse/lots-batches/api/selectionStockAvailableApi.ts";
import GenericList from "@features/panels/shared/GenericList.tsx";
import {useMemo} from "react";
import type {MRT_ColumnDef} from "material-react-table";
import type {ISelectionStock} from "@features/panels/warehouse/lots-batches/api/ISelectionStock.ts";

const LotsBatchesList = () => {
    const {t} = useTranslation(["form"]);

    const {useStore} = usePanel<unknown, ILotsBatchesStoreState>();
    const selectedSelectionStockId = useStore(state => state.uiState.selectedSelectionStockId);
    const setUIState = useStore(state => state.setUIState);

    const {data: selectionStocksAvailable = [], isLoading, isFetching} = selectionStockAvailableApi.useGetList();

    const columns = useMemo<MRT_ColumnDef<ISelectionStock>[]>(() => [
        {
            accessorKey: "name",
            header: t("lots-batch.name"),
        },
        {
            accessorKey: "available_pieces",
            header: t("lots-batch.available_pieces"),
        }
    ], [t])

    return (
        <GenericList
            data={selectionStocksAvailable}
            isLoading={isLoading}
            isFetching={isFetching}
            columns={columns}
            selectedId={selectedSelectionStockId}
            onRowSelect={(id) => setUIState({selectedSelectionStockId: id})}
        />
    )
}

export default LotsBatchesList;